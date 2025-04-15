const { compilerService } = require("../services/compilerService");
const { challengeSubmissionService } = require("../services/submissionService");
const { removeFolder } = require("../utils/tools/executeCode");
const {
  generateInputFile,
  generateLangFile,
} = require("../utils/tools/generateFile");

const compile = async (req, res) => {
  let path;
  try {
    const { input, code, lang } = req.body;
    const [folderPath, filePath] = await generateLangFile(code, lang);
    path = folderPath;
    if (input) await generateInputFile(folderPath, input, 0);
    const { status, ...response } = await compilerService(
      folderPath,
      filePath,
      0,
      input ? true : false
    );
    return res.status(status).send(response);
  } catch (err) {
    console.log(err);
    let { status = 500, ...response } = err;
    return res.status(status).send(response);
  } finally {
    removeFolder(path);
  }
};
const executeContestChallenge = async (req, res) => {
  try {
    let { question_id, code, lang } = req.body;
    let { status, ...response } = await challengeSubmissionService(
      question_id,
      code,
      lang
    );
    return res.status(status).send(response);
  } catch (err) {
    console.log(err);
    let { status = 500, ...response } = err;
    return res.status(status).send(response);
  }
};
module.exports = { compile, executeContestChallenge };
