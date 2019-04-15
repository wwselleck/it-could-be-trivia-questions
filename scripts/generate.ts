import glob = require("glob");
import pino = require("pino");
import { readFile, tomlToJson } from "./util";
import util = require("util");
import {
  SingleAnswerQuestion,
  QuestionType,
  Question,
  WithoutAutoFields,
  PartialQuestion
} from "../lib/types";
import { isPartialQuestion } from "../lib/is";

let logger = pino();

const TEMPLATES_GLOB = "./questions/generated/**/*.toml";

async function getTemplatesFilePaths(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    glob(TEMPLATES_GLOB, {}, (err: any, files: any) => {
      if (err) {
        reject(`idk m80 ${err.toString()}`);
      }
      resolve(files);
    });
  });
}

/**
 * This is the schema of the generator templates in
 * questions/generated/*.toml. Each question type has its own template schema.
 * The "kind" of each template is determined by templates.template.question_type_id
 */
type SingleAnswerQuestionTemplate = {
  data: Array<{
    // The values to provide the question text printf string
    values: Array<string>;
    answer: Array<string>;
  }>;
  template: {
    question_type_id: QuestionType.SingleAnswer;
    tags: Array<string>;
    detail: {
      // A printf style string that will be formatted using
      // `values`
      text: string;
    };
  };
};

type Template = SingleAnswerQuestionTemplate;

/**
 * A QuestionGenerator takes a template, and returns an array of partial questions
 * (Partial, because the real question types don't necessarily match the strucutre we return here. For example, the questions won't have an ID at this point.)
 *
 */
type QuestionGenerator<T extends Template, U extends Question> = (
  template: T
) => Array<WithoutAutoFields<U>>;

const singleAnswerQuestionGenerator: QuestionGenerator<
  SingleAnswerQuestionTemplate,
  SingleAnswerQuestion
> = (template: SingleAnswerQuestionTemplate) => {
  let partialQuestion = {
    question_type_id: template.template.question_type_id,
    tags: template.template.tags
  };

  return template.data.map(d => {
    return {
      ...partialQuestion,
      detail: {
        text: util.format(template.template.detail.text, ...d.values),
        answer: d.answer
      }
    };
  });
};

export async function generate(): Promise<Array<unknown>> {
  let templateFilePaths: Array<string> = await getTemplatesFilePaths();

  // TODO: Add type guarding here to ensure only valid
  // templates pass through
  let templateData: Array<any> = await Promise.all(
    templateFilePaths.map(async (path: string) => {
      return tomlToJson(await readFile(path));
    })
  );

  const generatedQuestions: Array<unknown> = templateData
    .map(td => {
      if (td.template.question_type_id === QuestionType.SingleAnswer) {
        // No actual type enforcement happening with this argument.
        // `td` is `any` at this point
        return singleAnswerQuestionGenerator(td);
      }
      return null;
    })
    .flat();

  return generatedQuestions;
}
