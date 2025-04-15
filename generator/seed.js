const { execSync } = require("child_process");

const DB_NAME = "loop";

const files = [
  "users",
  "colleges",
  "courses",
  "difficulties",
  "genders",
  "roles",
  "streams",
  "testtypes",
];
files.forEach((data) => {
  try {
    execSync(
      `mongoimport --db ${DB_NAME} --collection ${data} --drop --file "${process.cwd()}/generator/json/${data}.json" --jsonArray`
    );
  } catch (err) {
    console.log(`Cannot import documents into the database ${DB_NAME}`);
    console.log(err);
  }
});
