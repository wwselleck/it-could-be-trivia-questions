import { QuestionType } from "../lib/types";

export interface RawSingleAnswerQuestion {
  question_type_id: QuestionType.SingleAnswer;
  tags: Array<string>;
  detail: {
    text: string;
    answer: Array<string>;
  };
}

export interface RawMultipleAnswerQuestion {
  question_type_id: QuestionType.MultipleAnswer;
  tags: Array<string>;
  detail: {
    text: string;
    answer: Array<Array<string>>;
  };
}

export type RawQuestion = RawSingleAnswerQuestion | RawMultipleAnswerQuestion;
