const fs = require("fs");
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

async function build() {
  const questions = await readQuestionsFlattened();
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
