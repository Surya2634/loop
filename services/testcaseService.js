const Answer = require("../models/answers");
const Question = require("../models/questions");
const createMultipleTestCasesService = async ({ question_id, testcase }) => {
  const { sample, hidden } = testcase;
  if (!sample && !hidden)
    return Promise.reject({ status: 406, message: "Invalid parameters" });
  try {
    const question = await Question.findById(question_id);
    if (!question) {
      return Promise.reject({
        status: 404,
        message: `Question not found`,
      });
    } else {
      let testcases = {};
      testcases["sample"] = sample ? [{ ...sample }] : [];
      testcases["hidden"] = hidden ? [{ ...hidden }] : [];
      const new_testcase = new Answer({
        question_id,
        testcases,
      });
      await new_testcase.save();
      return Promise.resolve({
        status: 201,
        message: "Testcase created successfully",
        testcase_id: new_testcase._id,
      });
    }
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: "Unable to create testcase",
    });
  }
};
const createTestCaseService = async ({
  testcase_id,
  testcase,
  question_id,
}) => {
  let idx = 0;
  let { sample, hidden } = testcase;
  if (sample) sample = { ...sample, output: JSON.parse(sample.output) };
  else if (hidden) hidden = { ...hidden, output: JSON.parse(hidden.output) };
  const input = ["sample", "hidden"];
  if (hidden) idx = 1;
  try {
    let testcases = await Answer.findOne({ question_id });
    if (
      !testcases ||
      (testcases && !testcases.testcases.hidden && !testcases.testcases.sample)
    ) {
      return createMultipleTestCasesService({ question_id, testcase });
    }
    const isTestcaseAlreadyExist = [
      ...testcases.testcases["sample"],
      ...testcases.testcases["hidden"],
    ].find((e) => e.input == testcase[input[idx]].input);
    if (isTestcaseAlreadyExist) {
      return Promise.reject({
        status: 403,
        message: `Testcase given already exist`,
      });
    }
    let new_testcases = null;
    if (sample) {
      new_testcases = await Answer.findOneAndUpdate(
        { question_id },
        {
          $push: { "testcases.sample": testcase[input[idx]] },
        }
      );
    } else if (hidden) {
      new_testcases = await Answer.findOneAndUpdate(
        { question_id },
        {
          $push: { "testcases.hidden": testcase[input[idx]] },
        }
      );
    }
    return Promise.resolve({
      status: 201,
      testscases: new_testcases,
      message: `Testcase added successfully`,
    });
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: "Unable to create testcases",
    });
  }
};
const updateTestCaseService = async ({
  testcase_id,
  oldTestcase,
  testcase,
  type,
}) => {
  if (!oldTestcase && !sample && !hidden) {
    //Not sure about err code
    return Promise.reject({
      status: 403,
      message: "Invalid parameters",
    });
  }
  try {
    //Fetching all testcases
    const exist_testcases = await Answer.findById(testcase_id);
    if (!exist_testcases) {
      return Promise.reject({
        status: 404,
        message: `Testcase with id ${testcase_id} not found`,
      });
    } else {
      const isUpdatePresent = exist_testcases.testcases[type].find(
        (e) => e.input == testcase.input && e.output === testcase.output
      );
      if (isUpdatePresent) {
        return Promise.reject({
          status: 403,
          message: `Given testcase already present`,
        });
      }
      //updating in array
      exist_testcases["testcases"][type] = exist_testcases["testcases"][
        type
      ].map((e) => {
        if (e.input === oldTestcase.input && e.output === oldTestcase.output)
          return testcase;
        return e;
      });
      const updated_result = await Answer.findByIdAndUpdate(testcase_id, {
        $set: {
          testcases: exist_testcases["testcases"],
        },
      });
      if (!updated_result) {
        return Promise.reject({
          status: 403,
          message: `Error in updating testcase`,
        });
      } else {
        return Promise.resolve({
          status: 200,
          message: `Testcase update successfully`,
        });
      }
    }
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: "Unable to update testcase",
    });
  }
};
const getTestCasesService = async (question_id, role) => {
  try {
    let testcases = await Answer.findOne({ question_id });
    if (testcases) {
      if (role === "student")
        testcases.testcases.hidden = testcases.testcases?.hidden?.length || 0;
      return Promise.resolve({
        status: 200,
        message: `testcases found`,
        testcases: {
          id: testcases._id,
          sample: testcases.testcases.sample,
          hidden: testcases.testcases.hidden,
        },
      });
    } else {
      return Promise.resolve({
        status: 404,
        message: "No testcases found",
      });
    }
  } catch (err) {
    return Promise.reject({ status: 500, message: "Unable to get testcases" });
  }
};
const deleteTestCaseService = async ({
  type,
  testcase,
  testcase_id,
  question_id,
}) => {
  try {
    let exist_testcases = null;
    if (testcase_id) exist_testcases = await Answer.findById(testcase_id);
    if (!exist_testcases && question_id) {
      exist_testcases = await Answer.findOne({ question_id });
    }
    if (!exist_testcases) {
      return Promise.reject({ status: 404, message: "No testcases found" });
    }
    exist_testcases["testcases"][type] = exist_testcases["testcases"][
      type
    ].filter((e) => e.input !== testcase.input);
    if (
      exist_testcases["testcases"]["sample"].length === 0 &&
      exist_testcases["testcases"]["hidden"].length === 0
    ) {
      await Answer.findOneAndDelete({ question_id });
      return Promise.resolve({
        status: 202,
        message: `Testcase deleted successfully`,
      });
    }
    let updated_result = await Answer.findByIdAndUpdate(testcase_id, {
      $set: {
        testcases: exist_testcases["testcases"],
      },
    });
    if (!updated_result) {
      await Answer.findOneAndUpdate(
        { question_id },
        {
          $set: {
            testcases: exist_testcases["testcases"],
          },
        }
      );
    }
    return Promise.resolve({
      status: 202,
      message: `Testcase deleted successfully`,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: "Unable to delete testcase",
    });
  }
};
module.exports = {
  createTestCaseService,
  createMultipleTestCasesService,
  updateTestCaseService,
  deleteTestCaseService,
  getTestCasesService,
};
