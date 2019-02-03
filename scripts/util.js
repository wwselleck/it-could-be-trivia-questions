const fs = require("fs");
const toml = require("toml");
const glob = require("glob");

const QUESTIONS_GLOB = "./questions/**/*.toml";

function tomlToJson(tomlString) {
  return toml.parse(tomlString);
}

async function getQuestionFilePaths() {
  return new Promise((resolve, reject) => {
    glob(QUESTIONS_GLOB, {}, (err, files) => {
      if (err) {
        reject(`idk m8 ${err.toString()}`);
      }
      resolve(files);
    });
  });
}

async function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
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
async function readQuestions() {
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
async function readQuestionsFlattened() {
  let questions = await readQuestions();
  const flattened = questions.reduce((acc, curr) => {
    return [...acc, ...curr.data.questions];
  }, []);
  return flattened;
}

module.exports = {
  tomlToJson,
  getQuestionFilePaths,
  readFile,
  readQuestions,
  readQuestionsFlattened
};
