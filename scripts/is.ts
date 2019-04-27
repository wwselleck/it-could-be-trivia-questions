import { RawSingleAnswerQuestion, RawQuestion } from "./types";
import { QuestionType } from "../lib/types";

export function isRawSingleAnswerQuestion(
  o: unknown
): o is RawSingleAnswerQuestion {
  return Boolean(
    typeof o === "object" &&
      o !== null &&
      o["question_type_id"] &&
      o["question_type_id"] === QuestionType.SingleAnswer &&
      o["detail"] &&
      typeof o["detail"]["text"] === "string" &&
      ((Array.isArray(o["detail"]["answer"]) &&
        o["detail"]["answer"].length > 0) ||
        typeof o["detail"]["answerKey"] === "string")
  );
}

export function isRawQuestion(o: unknown): o is RawQuestion {
  return [isRawSingleAnswerQuestion].some(fn => fn(o));
}
