# It Could Be Trivia Questions

A trivia questions collection and library for interacting with those questions.

Please see [It Could Be Trivia Bot](github.com/wwselleck/it-could-be-trivia-bot) for an example of a project utilizing this library.

ICBTQ exports two things:

1. A JSON file containing the collection of trivia questions (`@it-could-be/trivia-questions/dist/questions.json`)
2. A library that does things with those questions (`import @it-could-be/trivia-questions`)


## Questions
Every question has the same top level structure

```json5
{
    // The kind of question it is
    question_type: 'single_answer'

    // Tags to associate with this question. They could be anything,
    // but are most often used for categorization.
    tags: ['video_games', 'pokemon']

    // A question_type specific object.
    detail: {
        ...
    }
}
```

From there, you have the specific kinds of questions. There are a few different types of questions, not all supported at the moment.

### Single Answer Question (supported)
These are questions that have one answer. For example...

> What was the first city to reach a population of 1 million? (Rome)

> What was the highest selling game on the PlayStation 2 (Grand Theft Auto: San Andreas)

> Who is the creator of the Python programming language? (Guido van Rossum)

```json5
{
    question_type: 'single_answer'
    tags: ['video_games', 'pokemon']

    detail: {
        // The text of the question
        text: "What is the lighest Pokemon?"

        // An array of acceptable correct answers
        answer: ['Gastly']
    }
}
```

### Multiple Answer Question (supported)
These are questions that have multiple correct answers. For example...

> Name every colony in the original 13 U.S. colonies.

> Name the Top 5 highest selling vidoe game consoles of all-time.

> Name the 5 women who were on the winning 2016 Summer Olympics U.S. women's gymnastics team.

```json5
{
    question_type: 'multiple_answer'
    tags: ['video_games', 'pokemon']

    detail: {
        // The text of the question
        text: "Name all of the Pokemon that appeared in episode 1 of the Pokemon anime."

        // An array of arrays of the correct answers
        answer: [
            ['Pikachu'],
            ['Nidorino'],
            ['Onix'],
            ['Gengar'],
            ['Spearow'],
            ['Ho-Oh', 'Ho Oh'],
            ['Bulbasaur'],
            ['Charmander'],
            ['Squirtle'],
            ['Pidgey'],
            ['Rattata'],
            ['Sandshrew'],
            ['Mankey'],
            ['Dodrio'],
            ['Magikarp'],
            ['Gyarados'],
        ]
    }
}
```

## Usage

```typescript
import questions from '@it-could-be/trivia-questions/dist/questions.json';
import * as TriviaQuestions from '@it-could-be/trivia-questions';

TriviaQuestions.getRandomQuestion(
    questions,
    {
        // An array of the types of questions you want to include [optional]
        types: [TriviaQuestions.QuestionType.SingleAnswer, TriviaQuestions.QuestionType.MultipleAnswer]
    }
})

let singleAnswerQuestion = TriviaQuestions.getRandomQuestion(questions, { types: [TriviaQuestions.QuestionType.SingleAnswer } })

// A module for verifying answers
let answerModule = TriviaQuestions.Answer;

/*
{
    // Was the input a correct answer for the question?
    isCorrect: false,

    // If the answer was correct, was the input exact? For example,
    // if the answer to a question is "Super Mario Bros.",
    // the input "Super Mario Bros." is an exact answer, and
    // "smb" is an inexact answer.
    isExactAnswer: false,

    // The exact answer for the question
    exactAnswer: 'TheAnswer',
}
*/
let answer = answerModule.SingleAnswerQuestion.verifyAnswer(singleAnswerQuestion, 'theanswer1')




let multipleAnswerQuestion = TriviaQuestions.getRandomQuestion(questions, { types: [TriviaQuestions.QuestionType.MultipleAnswer } })

/*
{
    isCorrect: correct,
    isExactAnswer: false,
    exactAnswer: 'TheAnswer',

      // The ID of the answer that was answered correctly
    answerId: '1'
}
*/
let answer = answerModule.SingleAnswerQuestion.verifyAnswer(singleAnswerQuestion, 'someInput')
```

### Types
To see specific type documentation, see `src/types.ts`, or the generated typedefs in the NPM package.


