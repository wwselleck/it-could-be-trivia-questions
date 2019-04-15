import fs = require("fs");
import pino = require("pino");
import uuidv4 = require("uuid/v4");
import { readQuestionsFlattened } from "./util";
import { generate } from "./generate";
import { Question, PartialQuestion } from "../lib/types";
import { isPartialQuestion } from "../lib/is";

let logger = pino();

async function writeQuestions(questions: Array<Question>) {
  return new Promise((resolve, reject) => {
    fs.writeFile("./dist/questions.json", JSON.stringify(questions), err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function assignQuestionIds(
  questions: Array<PartialQuestion>
): Array<PartialQuestion & { id: string }> {
  return questions.map(q => {
    return {
      ...q,
      id: uuidv4()
    };
  });
}

async function build() {
  let rawQuestions: Array<unknown> = await readQuestionsFlattened();
  let generatedQuestions: Array<unknown> = await generate();

  let unknownQuestions: Array<unknown> = [
    ...rawQuestions,
    ...generatedQuestions
  ];

  // TODO: The `as` casting here isn't particularly safe. Should actually
  // set it up so `isQuestion` converts this from Array<unknown>
  // to Array<PartialQuestion>
  let partialQuestions: Array<PartialQuestion> = unknownQuestions.filter(
    (uq: unknown) => {
      if (isPartialQuestion(uq)) {
        return true;
      } else {
        logger.warn({ uq }, "Dropping invalid question");
        return false;
      }
    }
  ) as Array<PartialQuestion>;

  let hydratedQuestions = assignQuestionIds(partialQuestions);

  await writeQuestions(hydratedQuestions);
}

if (require.main === module) {
  (async () => {
    try {
      await build();
    } catch (e) {
      console.error(e);
    }
  })();
}
