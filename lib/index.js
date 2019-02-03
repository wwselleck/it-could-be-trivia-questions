const questions = require("../dist/questions.json");

function getRandomQuestion() {
  let numQuestions = questions.length;
  let index = Math.floor(Math.random() * numQuestions);
  return questions[index];
}

module.exports = { getRandomQuestion };
