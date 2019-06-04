import { AnswerInput } from "../index";
import { MultipleAnswerQuestion } from "../types";
import { isAnswerCorrect } from "./answer";

export type AnswerResult = {
  isCorrect: boolean;
  isExactAnswer: boolean;
  exactAnswer: string | null;
  // The ID (index) of the answer that was answered correctly
  answerId: string | null;
};

export function verifyAnswer(
  question: MultipleAnswerQuestion,
  input: AnswerInput
): AnswerResult {
  let multipleAnswerList = question.detail.answer;

  let correctAnswerListIndex = multipleAnswerList.findIndex(answerList => {
    return answerList.some(answer => isAnswerCorrect(input, answer));
  });

  let isCorrect = correctAnswerListIndex !== -1;
  let exactAnswer = isCorrect
    ? question.detail.answer[correctAnswerListIndex][0]
    : null;

  return {
    isCorrect,
    exactAnswer,
    isExactAnswer: input === exactAnswer,
    answerId: isCorrect ? String(correctAnswerListIndex) : null
  };
}

export function getAnswer(question: MultipleAnswerQuestion) {
  return question.detail.answer[0];
}
