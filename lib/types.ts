export const enum QuestionType {
  MultipleAnswer = "multiple_answer",
  SingleAnswer = "single_answer"
}

interface AutoFields {
  id: string;
}

export interface BaseQuestion extends AutoFields {
  question_type_id: string;
  tags: Array<string>;
  detail: Object;
}

export interface MultipleAnswerQuestion extends BaseQuestion {
  question_type_id: QuestionType.MultipleAnswer;
  detail: {
    text: string;
    answer: Array<Array<string>>;
  };
}

export interface SingleAnswerQuestion extends BaseQuestion {
  question_type_id: QuestionType.SingleAnswer;
  detail: {
    text: string;
    answer: Array<string>;
  };
}

export type Question = MultipleAnswerQuestion | SingleAnswerQuestion;
