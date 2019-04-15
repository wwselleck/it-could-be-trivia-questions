export const enum QuestionType {
  MultipleAnswer = "multiple_answer",
  SingleAnswer = "single_answer",
  MultipleChoice = "multiple_choice"
}

type QuestionAutoFields = "id";

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
    answer: Array<string>;
  };
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  question_type_id: QuestionType.MultipleChoice;
  detail: {
    text: string;
    choices: Array<string>;
    answer: string;
  };
}

export interface SingleAnswerQuestion extends BaseQuestion {
  question_type_id: QuestionType.SingleAnswer;
  detail: {
    text: string;
    answer: Array<string>;
  };
}

export type Question =
  | MultipleAnswerQuestion
  | SingleAnswerQuestion
  | MultipleChoiceQuestion;

export type PartialMultipleAnswerQuestion = WithoutAutoFields<
  MultipleAnswerQuestion
>;
export type PartialSingleAnswerQuestion = WithoutAutoFields<
  SingleAnswerQuestion
>;
export type PartialMultipleChoiceQuestion = WithoutAutoFields<
  MultipleChoiceQuestion
>;

export type PartialQuestion =
  | PartialMultipleChoiceQuestion
  | PartialMultipleAnswerQuestion
  | PartialSingleAnswerQuestion;

// https://stackoverflow.com/questions/48215950/exclude-property-from-type
export type WithoutAutoFields<T extends Question> = Pick<
  T,
  Exclude<keyof T, QuestionAutoFields>
>;
