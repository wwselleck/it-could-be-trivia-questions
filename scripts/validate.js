const fs = require("fs");
const toml = require("toml");

const { readQuestions } = require("./util");

async function validate() {
  const questions = await readQuestions();
  let results = {};
  for (let question of questions) {
    let data = question.data;
    let result = await validateFile(data);
    results[question.filePath] = result;
  }
  console.log(results);
}

async function validateFile(data) {
  const result = await topLevelValidator(data);
  return result;
}

const validateDetailField = question => ({
  valid: question.detail && typeof question.detail === "object"
});

const createQuestionValidator = fn => question => {
  let result = validateDetailField(question);
  if (!result.valid) {
    return result;
  }
  return fn(question);
};

const MultipleChoiceValidator = createQuestionValidator(question => {
  return {
    valid: Boolean(
      question.detail.text &&
        Array.isArray(question.detail.choices) &&
        question.detail.answer
    )
  };
});

const SingleAnswerValidator = createQuestionValidator(question => {
  return {
    valid: Boolean(question.detail.text && question.detail.answer)
  };
});

const MultipleAnswerValidator = createQuestionValidator(question => {
  return {
    valid: Boolean(
      question.detail.text && Array.isArray(question.detail.answer)
    )
  };
});

const QuestionTypeValidators = {
  multiple_answer: MultipleAnswerValidator,
  single_answer: SingleAnswerValidator,
  multiple_choice: MultipleChoiceValidator
};

const TopLevelRequiredValidators = {
  question_type_id: val => ({
    valid:
      typeof val === "string" && val.length > 0 && val in QuestionTypeValidators
  }),
  category_id: val => ({
    valid: Boolean(typeof val === "string" && val.length)
  })
};

async function topLevelValidator(data) {
  let questions = data.questions;
  const requiredFields = Object.keys(TopLevelRequiredValidators);
  for (let question of questions) {
    for (let field of requiredFields) {
      let val = question[field];
      if (!val) {
        return {
          valid: false,
          error: `Required top-level field ${field} missing for question: \n ${JSON.stringify(
            question,
            null,
            2
          )}`
        };
      }
      let result = TopLevelRequiredValidators[field](val);
      if (!result.valid) {
        return result;
      }
    }
    let questionTypeValidator =
      QuestionTypeValidators[question.question_type_id];
    let result = await questionTypeValidator(question);
    if (!result.valid) {
      return {
        valid: false,
        error: `Question failed ${
          question.question_type_id
        } question validation ${JSON.stringify(question, null, 2)}`
      };
    }
  }
  return { valid: true };
}

if (require.main === module) {
  (async () => {
    try {
      await validate();
    } catch (e) {
      console.error(e);
    }
  })();
}
