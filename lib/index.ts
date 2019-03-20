const questions = require("../dist/questions.json") as Array<Question>;
import * as SingleAnswerQuestion from "./single_answer_question";

export type Answer = string;

export const enum QuestionType {
  MultipleAnswer = "multiple_answer",
  SingleAnswer = "single_answer",
  MultipleChoice = "multiple_choice"
}

export interface BaseQuestion {
  id: string;
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

export type Question =
  | MultipleAnswerQuestion
  | SingleAnswerQuestion.SingleAnswerQuestion
  | MultipleChoiceQuestion;

export function getRandomQuestion(): Question {
  //temp
  let filteredQuestions = questions.filter(
    q => q.question_type_id === QuestionType.SingleAnswer
  );
  let numQuestions = filteredQuestions.length;
  let index = Math.floor(Math.random() * numQuestions);
  return filteredQuestions[index];
}

export function getQuestionById(id: string): Question | null {
  return questions.find((q: Question) => q.id === id) || null;
}

export function verifyAnswer(question: Question, answer: Answer) {
  switch (question.question_type_id) {
    case QuestionType.SingleAnswer:
      return SingleAnswerQuestion.verifyAnswer(question, answer);
    default:
      throw new Error("Invalid question type");
  }
}

export { SingleAnswerQuestion };
