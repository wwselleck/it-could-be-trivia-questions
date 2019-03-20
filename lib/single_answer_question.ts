import { BaseQuestion, Answer, QuestionType } from "./index";

export interface SingleAnswerQuestion extends BaseQuestion {
  question_type_id: QuestionType.SingleAnswer;
  detail: {
    text: string;
    answer: Array<string>;
  };
}

export type AnswerResult = {
  isCorrect: boolean;
  isExactAnswer: boolean;
  exactAnswer: string;
};

export function verifyAnswer(
  question: SingleAnswerQuestion,
  answer: Answer
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
