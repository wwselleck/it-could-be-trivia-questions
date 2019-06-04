import { AnswerInput } from "../index";
import { SingleAnswerQuestion } from "../types";
import { isAnswerCorrect } from "./answer";

export type AnswerResult = {
  isCorrect: boolean;
  isExactAnswer: boolean;
  exactAnswer: string;
};

export function verifyAnswer(
  question: SingleAnswerQuestion,
  input: AnswerInput
): AnswerResult {
  let answerList = question.detail.answer;

  let isCorrect = answerList.some(answer => {
    return isAnswerCorrect(input, answer);
  });

  let exactAnswer = question.detail.answer[0];

  return {
    isCorrect,
    exactAnswer,
    isExactAnswer: input === exactAnswer
  };
}

export function getAnswer(question: SingleAnswerQuestion) {
  return question.detail.answer[0];
}
