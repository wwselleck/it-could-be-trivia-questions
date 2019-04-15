import { AnswerInput } from "../index";
import { SingleAnswerQuestion } from "../types";

export type AnswerResult = {
  isCorrect: boolean;
  isExactAnswer: boolean;
  exactAnswer: string;
};

export function verifyAnswer(
  question: SingleAnswerQuestion,
  answer: AnswerInput
): AnswerResult {
  let isCorrect = question.detail.answer.some(correctAnswer => {
    return correctAnswer.toLowerCase() === answer.toLowerCase();
  });
  let exactAnswer = question.detail.answer[0];
  return {
    isCorrect,
    exactAnswer,
    isExactAnswer: answer === exactAnswer
  };
}

export function getAnswer(question: SingleAnswerQuestion) {
  return question.detail.answer[0];
}
