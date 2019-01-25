const fs = require("fs");
const toml = require("toml");
const glob = require("glob");
const Ajv = require("ajv");

const QUESTIONS_GLOB = "./questions/**/*.toml";
const SCHEMA_PATH = "./questions/questions_schema.json";

function tomlToJson(tomlString) {
  return toml.parse(tomlString);
}

async function readSchema() {
  return JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
}

async function getQuestionFilePaths() {
  return new Promise((resolve, reject) => {
    glob(QUESTIONS_GLOB, {}, (err, files) => {
      if (err) {
        reject(`idk m8 ${err.toString()}`);
      }
      resolve(files);
    });
  });
}

async function readFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function validateTomlString(schema, tomlString) {
  const validate = new Ajv().compile(schema);
  const json = tomlToJson(tomlString);
  const valid = validate(json);
  if (valid) {
    return null;
  }
  return validate.errors;
}

(async () => {
  const filePaths = await getQuestionFilePaths();
  const files = await Promise.all(
    filePaths.map(async filePath => {
      const content = await readFile(filePath);
      return { filePath, content };
    })
  );
  const schema = await readSchema();
  files.map(file => {
    const errors = validateTomlString(schema, file.content);
    if (!errors) {
      console.log(`PASSED [${file.filePath}]`);
    } else {
      console.log(
        `FAILED [${file.filePath}]: ${JSON.stringify(errors, null, 2)}`
      );
    }
  });
})();
