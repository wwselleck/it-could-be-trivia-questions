import "mocha";
import assert = require("assert");
import * as TriviaQuestion from "./index";

let singleAnswerQuestion: TriviaQuestion.SingleAnswerQuestion = {
  id: "abc",
  question_type_id: TriviaQuestion.QuestionType.SingleAnswer,
  tags: ["whocares"],
  detail: {
    text: "a question",
    answer: ["AnAnswer"]
  }
};

describe("Trivia Questions Library", () => {
  describe("getQuestionById", () => {});
  describe("Answer", () => {
    describe("SingleAnswerQuestion", () => {
      it("should accept exact casing", () => {
        let question = singleAnswerQuestion;
        let answer = "AnAnswer";
        let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
          question,
          answer
        );
        assert(result.isCorrect === true);
      });

      it("should accept different casing ", () => {
        let question = singleAnswerQuestion;
        let answer = "anANsWer";
        let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
          question,
          answer
        );
        assert(result.isCorrect === true);
      });
    });
  });
});
