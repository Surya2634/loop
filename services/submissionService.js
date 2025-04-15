const Submission = require("../models/submissions");
const User = require("../models/users");
const Contest = require("../models/contests");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const { compilerService } = require("./compilerService");
const { updateSessionService } = require("./sessionService");
const {
  generateLangFile,
  generateInputFile,
} = require("../utils/tools/generateFile");
const { removeFolder } = require("../utils/tools/executeCode");
const createSubmissionService = async (submissionDetails) => {
  let { user_id, contest_id, quizzes, challenges } = submissionDetails;
  try {
    let user = await User.findById(user_id);
    if (!user)
      return Promise.reject({
        status: 404,
        message: `User not found`,
      });
    let contest = await Contest.findById(contest_id);
    if (!contest)
      return Promise.reject({
        status: 404,
        message: `Contest not found`,
      });
    let submission = await Submission.findOne({ user_id, contest_id });
    if (submission)
      return Promise.reject({
        status: 403,
        message: `Contest already submitted.`,
      });
    const reducer = (previousValue, currentValue) =>
      previousValue + currentValue;
    let total_score = 0;
    let quizScore = await Promise.all(
      quizzes.map(async (quiz) => {
        try {
          const { score } = await quizSubmissionService(quiz);
          return score || 0;
        } catch (err) {
          console.log(err);
        }
        return 0;
      })
    );
    total_score += quizScore.reduce(reducer, 0);
    let challengeScore = await Promise.all(
      challenges.map(async (challenge) => {
        try {
          const { score } = await challengeSubmissionService(
            challenge.question_id,
            challenge.code,
            challenge.lang,
            true
          );
          return score || 0;
        } catch (err) {
          console.log(err);
        }
        return 0;
      })
    );
    total_score += challengeScore.reduce(reducer, 0);
    let newSubmission = new Submission({
      user_id,
      contest_id,
      score: total_score,
    });
    newSubmission.created_at = new Date();
    await newSubmission.save();
    await updateSessionService(contest_id, user_id, newSubmission.created_at);
    return Promise.resolve({
      status: 201,
      message: `Submitted successfully!`,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: `Error in submitting.`,
    });
  }
};
const getSubmissionsService = async (
  page = 1,
  limit = 10,
  submissionDetails
) => {
  let { user_id, contest_id } = submissionDetails;
  try {
    const submissions = {};
    submissions["leaderBoard"] = await Submission.find({ contest_id })
      .populate({ path: "user_id", model: "users", select: "name regno" })
      .sort({ score: "desc", created_at: "asc" })
      .limit(5);
    if (page == 1) {
      submissions["totalCount"] =
        user_id && contest_id
          ? await Submission.countDocuments({ user_id, contest_id })
          : user_id
          ? await Submission.countDocuments({ user_id })
          : contest_id
          ? await Submission.countDocuments({ contest_id })
          : 0;
    }
    submissions["submissions"] =
      user_id && contest_id
        ? await Submission.find({ user_id, contest_id }).populate({
            path: "user_id",
            model: "users",
            select: "name regno",
          })
        : user_id
        ? await Submission.find({ user_id })
            .populate({ path: "user_id", model: "users", select: "name regno" })
            .sort({ score: "desc" })
            .limit(limit * 1)
            .skip((page > 0 ? page - 1 : 1) * limit)
        : contest_id
        ? await Submission.find({ contest_id })
            .populate({ path: "user_id", model: "users", select: "name regno" })
            .sort({ score: "desc", created_at: "asc" })
            .limit(limit * 1)
            .skip((page > 0 ? page - 1 : 1) * limit)
        : [];
    return Promise.resolve({
      status: 200,
      message: `Submissions found!`,
      submissions,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: `Error in getting submissions.`,
    });
  }
};
const getAllSubmissionsService = async (page, limit) => {
  let response = {};
  try {
    response.modelCount = await Submission.countDocuments();
    const submissions = await Submission.find({})
      .limit(limit * 1)
      .skip((page > 0 ? page - 1 : 1) * limit);
    response.total = submissions.length;
    response.submissions = submissions;
    return Promise.resolve({
      status: 200,
      message: `Submissions found!`,
      response,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: `Error in getting submissions.`,
    });
  }
};
const quizSubmissionService = async (quizAnswers) => {
  let score = 0;
  const answers = await Promise.all(
    quizAnswers.map(async ({ id, option }) => {
      try {
        const answer = await Answer.findById(id);
        if (option === answer.options.correctOption)
          return Promise.resolve(true);
      } catch (err) {
        console.log(err);
      }
      return Promise.reject(false);
    })
  );
  answers.forEach((ans) => (ans ? score++ : null));
  return Promise.resolve({
    status: 200,
    score,
  });
};
const challengeSubmissionService = async (
  question_id,
  code,
  lang,
  submission = false
) => {
  if (submission && !question_id)
    return Promise.resolve({ status: 200, score: 0 });
  let isSampleFailed = false;
  let score = 0;
  let path = "";
  try {
    const max_score = (await Question.findById(question_id))?.max_score || 1;
    const testcases = (await Answer.findOne({ question_id }))?.testcases || {};
    const totalTestCases =
      testcases?.sample?.length + testcases?.hidden?.length;
    let sampleTestCaseOutput = [];

    //? Generate File
    const [folderPath, filePath] = await generateLangFile(code, lang);
    path = folderPath;

    //? Sample Testcases
    for (let i = 0; i < testcases?.sample.length; i++) {
      try {
        await generateInputFile(
          folderPath,
          JSON.parse(testcases?.sample[i].input || '""'),
          i
        );
        let { output } = await compilerService(folderPath, filePath, i, true);
        output = JSON.stringify(output.replace(/[\n\r]$/, "")) || "";
        let testCaseOutput = {
          expectedOutput: testcases?.sample[i].output,
          actualOutput: output,
        };
        if (testCaseOutput.expectedOutput === output) {
          if (submission) score++;
          testCaseOutput.errors = false;
        } else {
          isSampleFailed = true;
          testCaseOutput.errors = true;
        }
        sampleTestCaseOutput.push(testCaseOutput);
      } catch (err) {
        return Promise.resolve({
          status: 200,
          errors: true,
          err: err.err,
        });
      }
    }
    if (!submission && isSampleFailed)
      return Promise.resolve({
        status: 200,
        isSampleFailed,
        sample: sampleTestCaseOutput,
        message: "Sample testCases Failed.",
      });
    const hiddenTestCaseOutput = await Promise.all(
      testcases?.hidden?.map(async (testcase, index) => {
        try {
          await generateInputFile(
            folderPath,
            JSON.parse(testcase.input || '""'),
            index + testcases?.sample.length
          );
          let { output } = await compilerService(
            folderPath,
            filePath,
            index + testcases?.sample.length,
            true
          );
          output = JSON.stringify(output.replace(/[\n\r]$/, "")) || "";
          if (output === testcase.output) {
            if (submission) score++;
            return true;
          } else return false;
        } catch (err) {
          return false;
        }
      })
    );
    if (submission) {
      let total_score = Math.round((score / totalTestCases) * max_score);
      return Promise.resolve({ status: 200, score: total_score });
    }
    return Promise.resolve({
      status: 200,
      sample: sampleTestCaseOutput,
      hidden: hiddenTestCaseOutput,
      message: "Compiled Successfully",
    });
  } catch (err) {
    console.log(err);
    if (err.err) {
      return Promise.resolve({
        status: 200,
        errors: true,
        err: err.err,
      });
    } else
      return Promise.reject({
        status: 500,
        message: "Error in checking testcases.",
      });
  } finally {
    removeFolder(path);
  }
};
module.exports = {
  createSubmissionService,
  getSubmissionsService,
  getAllSubmissionsService,
  quizSubmissionService,
  challengeSubmissionService,
};
