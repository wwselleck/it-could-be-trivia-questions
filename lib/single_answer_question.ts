import { BaseQuestion, Answer, QuestionType } from "./index";

export interface SingleAnswerQuestion extends BaseQuestion {
  question_type_id: QuestionType.SingleAnswer;
  detail: {
    text: string;
    answer: Array<string>;
  };
}

export function verifyAnswer(
  question: SingleAnswerQuestion,
  answer: Answer
): boolean {
  return question.detail.answer.some(correctAnswer => {
    return correctAnswer.toLowerCase() === answer.toLowerCase();
  });
}
