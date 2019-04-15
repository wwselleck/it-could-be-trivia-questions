import { Question, QuestionType } from "./types";
const questions = require("./questions.json") as Array<Question>;
import * as Answer from "./answer";

export type AnswerInput = string;

export function getRandomQuestion(): Question {
  //temp
  let filteredQuestions = questions.filter(
    q => q.question_type_id === QuestionType.SingleAnswer
  );
  let numQuestions = filteredQuestions.length;
  let index = Math.floor(Math.random() * numQuestions);
  return filteredQuestions[index];
}

export function getQuestionById(id: string): Question | null {
  return questions.find((q: Question) => q.id === id) || null;
}

export function verifyAnswer(question: Question, answer: AnswerInput) {
  switch (question.question_type_id) {
    case QuestionType.SingleAnswer:
      return Answer.SingleAnswerQuestion.verifyAnswer(question, answer);
    default:
      throw new Error("Invalid question type");
  }
}

export { Answer };
export * from "./types";
