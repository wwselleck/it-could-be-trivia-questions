import "mocha";
import assert = require("assert");
import * as TriviaQuestion from "./index";

const createSingleAnswerQuestion = (
  answer: Array<string>
): TriviaQuestion.SingleAnswerQuestion => ({
  id: "abc",
  question_type_id: TriviaQuestion.QuestionType.SingleAnswer,
  tags: ["whocares"],
  detail: {
    text: "a question",
    answer
  }
});

const createMultipleAnswerQuestion = (
  answer: Array<Array<string>>
): TriviaQuestion.MultipleAnswerQuestion => ({
  id: "abc",
  question_type_id: TriviaQuestion.QuestionType.MultipleAnswer,
  tags: ["whocares"],
  detail: {
    text: "a question",
    answer
  }
});

describe("Trivia Questions Library", () => {
  describe("getQuestionById", () => {});
  describe("Answer", () => {
    describe("SingleAnswerQuestion", () => {
      it("should accept exact answer", () => {
        let question = createSingleAnswerQuestion(["Super Mario Bros. 3"]);
        let answer = "Super Mario Bros. 3";
        let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
          question,
          answer
        );
        assert(result.isCorrect === true);
      });

      it("should accept exact answer with alternate casing", () => {
        let question = createSingleAnswerQuestion(["Super Mario Bros. 3"]);
        let answer = "sUper Mario bros. 3";
        let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
          question,
          answer
        );
        assert(result.isCorrect === true);
      });

      it("should accept answer without trailing punctuation", () => {
        let question = createSingleAnswerQuestion(["Super Mario Bros. 3"]);
        let answer = "Super Mario Bros 3";
        let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
          question,
          answer
        );
        assert(result.isCorrect === true);
      });

      it("should accept abbreviation if answer is >= 3 tokens long", () => {
        let entries: Array<[TriviaQuestion.SingleAnswerQuestion, string]> = [
          [createSingleAnswerQuestion(["Super Mario Bros. 3"]), "smb3"],
          [createSingleAnswerQuestion(["Mario Kart: Double Dash"]), "mkdd"]
        ];

        entries.forEach(([question, answer]) => {
          let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
            question,
            answer
          );
          assert(result.isCorrect === true);
        });
      });

      it("should accept abbreviation if answer is >= 3 tokens long and space before last token if last token is number", () => {
        let question = createSingleAnswerQuestion(["Super Mario Bros. 3"]);
        let answer = "smb 3";
        let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
          question,
          answer
        );
        assert(result.isCorrect === true);
      });

      it("should not accept abbreviation if answer is < 3 tokens long", () => {
        let entries: Array<[TriviaQuestion.SingleAnswerQuestion, string]> = [
          [createSingleAnswerQuestion(["Mr. Mime"]), "mm"]
        ];

        entries.forEach(([question, answer]) => {
          let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
            question,
            answer
          );
          assert(result.isCorrect === false);
        });
      });

      it("should accept abbreviation if answer >= 3 tokens long and last token is multi-digit number", () => {
        let question = createSingleAnswerQuestion(["Super Mario 64"]);
        let answer = "sm64";
        let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
          question,
          answer
        );
        assert(result.isCorrect === true);
      });

      it("should not accept abbreviation if answer >= 3 tokens long and last token is multi-digit number but only first digit is given", () => {
        let question = createSingleAnswerQuestion(["Super Mario 64"]);
        let answer = "sm6";
        let result = TriviaQuestion.Answer.SingleAnswerQuestion.verifyAnswer(
          question,
          answer
        );
        assert(result.isCorrect === false);
      });
    });
    describe("MultipleAnswerQuestion", () => {
      it("should accept a correct answer", () => {
        let question = createMultipleAnswerQuestion([["A"], ["B"], ["C"]]);
        let input = "B";
        let result = TriviaQuestion.Answer.MultipleAnswerQuestion.verifyAnswer(
          question,
          input
        );
        assert(result.isCorrect === true);
      });

      it("should not accept an incorrect answer", () => {
        let question = createMultipleAnswerQuestion([["A"], ["B"], ["C"]]);
        let input = "BC";
        let result = TriviaQuestion.Answer.MultipleAnswerQuestion.verifyAnswer(
          question,
          input
        );
        assert(result.isCorrect === false);
      });

      it("should return the correct ID of the answered answer", () => {
        let question = createMultipleAnswerQuestion([["A"], ["B"], ["C"]]);
        let input = "B";
        let result = TriviaQuestion.Answer.MultipleAnswerQuestion.verifyAnswer(
          question,
          input
        );
        assert(result.answerId === "1");
      });

      it("should return the exact answer of the answered answer", () => {
        let question = createMultipleAnswerQuestion([["A"], ["B"], ["C"]]);
        let input = "b";
        let result = TriviaQuestion.Answer.MultipleAnswerQuestion.verifyAnswer(
          question,
          input
        );
        assert(result.exactAnswer === "B");
      });
    });
  });
});
