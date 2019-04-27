import glob = require("glob");
import pino = require("pino");
import { readFile, tomlToJson } from "./util";
import util = require("util");
import { SingleAnswerQuestion, QuestionType, Question } from "../lib/types";
import { RawQuestion, RawSingleAnswerQuestion } from "./types";

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
    answer?: Array<string>;
    answerKey: string;
  }>;
  template: {
    question_type_id: QuestionType.SingleAnswer;
    tags: Array<string>;
    // A printf style string that will be formatted using
    // `values`
    text: string;
  };
};

type Template = SingleAnswerQuestionTemplate;

/**
 * A QuestionGenerator takes a template, and returns an array of raw questions
 */
type QuestionGenerator<T extends Template, U extends RawQuestion> = (
  template: T
) => Array<U>;

const singleAnswerQuestionGenerator: QuestionGenerator<
  SingleAnswerQuestionTemplate,
  RawSingleAnswerQuestion
> = (template: SingleAnswerQuestionTemplate) => {
  let partialQuestion = {
    question_type_id: template.template.question_type_id,
    tags: template.template.tags
  };

  return template.data.map(d => {
    return {
      ...partialQuestion,
      detail: {
        text: util.format(template.template.text, ...d.values),
        answer: d.answer
      }
    };
  });
};

export async function generate(): Promise<Array<RawQuestion>> {
  let templateFilePaths: Array<string> = await getTemplatesFilePaths();

  // TODO: Add type guarding here to ensure only valid
  // templates pass through
  let templateData: Array<any> = await Promise.all(
    templateFilePaths.map(async (path: string) => {
      return tomlToJson(await readFile(path));
    })
  );

  const generatedQuestions: Array<RawQuestion> = templateData
    .map(td => {
      if (td.template.question_type_id === QuestionType.SingleAnswer) {
        // No actual type enforcement happening with this argument.
        // `td` is `any` at this point
        return singleAnswerQuestionGenerator(td);
      }
      return null;
    })
    .filter(x => x)
    .flat();

  return generatedQuestions;
}
