const fs = require("fs");
const uuidv4 = require("uuid/v4");
const { readQuestionsFlattened } = require("./util");

async function writeQuestions(questions) {
  return new Promise((resolve, reject) => {
    fs.writeFile("./dist/questions.json", JSON.stringify(questions), err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
}

function assignQuestionIds(questions) {
  return questions.map(q => {
    return {
      ...q,
      id: uuidv4()
    };
  });
}

async function build() {
  let questions = await readQuestionsFlattened();
  questions = assignQuestionIds(questions);

  await writeQuestions(questions);
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
