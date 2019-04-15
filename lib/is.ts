import {
  QuestionType,
  PartialSingleAnswerQuestion,
  PartialQuestion
} from "./types";

export function isPartialSingleAnswerQuestion(
  o: unknown
): o is PartialSingleAnswerQuestion {
  return Boolean(
    typeof o === "object" &&
      o !== null &&
      o["question_type_id"] &&
      o["question_type_id"] === QuestionType.SingleAnswer &&
      o["detail"] &&
      typeof o["detail"]["text"] === "string" &&
      typeof Array.isArray(o["detail"]["answer"]) &&
      o["detail"]["answer"].length > 0
  );
}

export function isPartialQuestion(o: unknown): o is PartialQuestion {
  return [isPartialSingleAnswerQuestion].some(fn => fn(o));
}
