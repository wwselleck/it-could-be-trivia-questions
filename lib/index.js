const questions = require("../dist/questions.json");

function getRandomQuestion() {
  let numQuestions = questions.length;
  let index = Math.floor(Math.random() * numQuestions);
  return questions[index];
}

function getQuestionById(id) {
  return questions.find(q => q.id === id);
}

module.exports = { getRandomQuestion, getQuestionById };
