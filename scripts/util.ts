const fs = require("fs");
const toml = require("toml");
const glob = require("glob");

const uuidv4 = require("uuid/v4");

import { Question, PartialQuestion } from "../lib/types";

const QUESTIONS_GLOB = "./questions/raw/**/*.toml";

export function tomlToJson(tomlString: string) {
  return toml.parse(tomlString);
}

export async function getQuestionFilePaths(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    glob(QUESTIONS_GLOB, {}, (err: any, files: any) => {
      if (err) {
        reject(`idk m8 ${err.toString()}`);
      }
      resolve(files);
    });
  });
}

export async function readFile(filePath: any): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err: any, data: any) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

/*
 * Returns array of form
 * [
 *   {
 *    filePath: // path of questions file
 *    data: // JSON data of questions
 *   }
 * ]
 */
export async function readQuestions() {
  const filePaths = await getQuestionFilePaths();
  let pathsToData = filePaths.map(async filePath => {
    let tomlString = await readFile(filePath);
    return {
      data: tomlToJson(tomlString),
      filePath: filePath
    };
  });
  const jsonQuestions = await Promise.all(pathsToData);
  return jsonQuestions;
}

/*
 * Returns array of form
 * [
 *   {
 *      ...questionData
 *   }
 * ]
 */
export async function readQuestionsFlattened() {
  let questions = await readQuestions();
  const flattened = questions.reduce((acc, curr) => {
    return [...acc, ...curr.data.questions];
  }, []);
  return flattened;
}

function assignQuestionId(question: PartialQuestion) {
  return {
    ...question,
    id: uuidv4()
  };
}

export function hydrateQuestion(q: PartialQuestion): Question {
  return assignQuestionId(q);
}
