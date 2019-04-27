import fs = require("fs");
import pino = require("pino");
import uuidv4 = require("uuid/v4");
import { readQuestionsFlattened } from "./util";
import { generate } from "./generate";
import { Question } from "../lib/types";
import { RawQuestion } from "./types";
import { isRawQuestion } from "./is";

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

function assignQuestionId(question: RawQuestion) {
  return {
    ...question,
    id: uuidv4()
  };
}

async function build() {
  let staticQuestions: Array<unknown> = await readQuestionsFlattened();
  let generatedQuestions: Array<RawQuestion> = await generate();

  let uncheckedRawQuestions: Array<unknown> = [
    ...staticQuestions,
    ...generatedQuestions
  ];

  // TODO: The `as` casting here isn't particularly safe. Should actually
  // set it up so `isQuestion` converts this from Array<unknown>
  // to Array<PartialQuestion>
  let rawQuestions: Array<RawQuestion> = uncheckedRawQuestions.filter(
    (uq: unknown) => {
      if (isRawQuestion(uq)) {
        return true;
      } else {
        logger.warn({ uq }, "Dropping invalid question");
        return false;
      }
    }
  ) as Array<RawQuestion>;

  let hydratedQuestions = rawQuestions.map(assignQuestionId);

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
