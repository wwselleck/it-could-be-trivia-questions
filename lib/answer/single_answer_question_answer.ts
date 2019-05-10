import { AnswerInput } from "../index";
import { SingleAnswerQuestion } from "../types";

export type AnswerResult = {
  isCorrect: boolean;
  isExactAnswer: boolean;
  exactAnswer: string;
};

function isStringNumber(str: string) {
  return !isNaN(parseFloat(str)) && isFinite((str as unknown) as number);
}

function withoutPunctuation(str: string): string {
  return str.replace(/[^a-zA-Z0-9\s]+/g, "");
}

function generateAbbreviations(answer: string): Array<string> {
  let tokens = answer.split(" ");
  if (tokens.length < 3) {
    return [];
  }

  let abbreviationTokens: Array<string> = tokens.map(t =>
    isStringNumber(t) ? t : t.charAt(0)
  );

  let abbreviation = abbreviationTokens.join("");

  let abbreviationWithNumber = null;

  if (isStringNumber(abbreviationTokens[abbreviationTokens.length - 1])) {
    let insertPosition = abbreviationTokens.length - 1;
    abbreviationWithNumber = [
      ...abbreviationTokens.slice(0, insertPosition),
      " ",
      ...abbreviationTokens.slice(insertPosition)
    ].join("");
  }

  return [abbreviation, abbreviationWithNumber].filter(x => x);
}

function generateAnswerVariations(answer: string): Array<string> {
  let abbreviations = generateAbbreviations(answer);
  let answerWithoutPunctuation = withoutPunctuation(answer);
  return [...abbreviations, answerWithoutPunctuation];
}

export function verifyAnswer(
  question: SingleAnswerQuestion,
  answer: AnswerInput
): AnswerResult {
  let answers = [
    ...question.detail.answer,
    ...question.detail.answer.map(generateAnswerVariations).flat()
  ];

  console.log(answers);

  let isCorrect = answers.some(correctAnswer => {
    return correctAnswer.toLowerCase() === answer.toLowerCase();
  });

  let exactAnswer = question.detail.answer[0];
  return {
    isCorrect,
    exactAnswer,
    isExactAnswer: answer === exactAnswer
  };
}

export function getAnswer(question: SingleAnswerQuestion) {
  return question.detail.answer[0];
}
