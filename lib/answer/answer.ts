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

function isStringNumber(str: string) {
  return !isNaN(parseFloat(str)) && isFinite((str as unknown) as number);
}

function withoutPunctuation(str: string): string {
  return str.replace(/[^a-zA-Z0-9\s]+/g, "");
}

function generateAnswerVariations(answer: string): Array<string> {
  let abbreviations = generateAbbreviations(answer);
  let answerWithoutPunctuation = withoutPunctuation(answer);
  return [...abbreviations, answerWithoutPunctuation];
}

export function isAnswerCorrect(input: string, answer: string) {
  let correctAnswers = [answer, ...generateAnswerVariations(answer)];
  return correctAnswers.some(a => input.toLowerCase() === a.toLowerCase());
}
