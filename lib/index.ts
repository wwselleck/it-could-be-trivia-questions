import { Question, QuestionType } from "./types";
import * as Answer from "./answer";

export type AnswerInput = string;

type GetQuestionFilter = {
  types: Array<QuestionType>;
};

export function getRandomQuestion(
  questions: Array<Question>,
  filter?: GetQuestionFilter
): Question {
  let filteredQuestions = filter
    ? questions.filter(q => filter.types.includes(q.question_type_id))
    : questions;
  let numQuestions = filteredQuestions.length;
  let index = Math.floor(Math.random() * numQuestions);
  return filteredQuestions[index];
}

export function getQuestionById(
  questions: Array<Question>,
  id: string
): Question | null {
  return questions.find((q: Question) => q.id === id) || null;
}

export function verifyAnswer(question: Question, answer: AnswerInput) {
  switch (question.question_type_id) {
    case QuestionType.SingleAnswer:
      return Answer.SingleAnswerQuestion.verifyAnswer(question, answer);
    case QuestionType.MultipleAnswer:
      return Answer.MultipleAnswerQuestion.verifyAnswer(question, answer);
    default:
      throw new Error("Invalid question type");
  }
}

export { Answer };
export * from "./types";
