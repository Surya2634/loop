const Contest = require("../models/contests");
const Submission = require("../models/submissions");
const { mapCollegeId } = require("../utils/helper");
const contestSubmissionsChartService = async (user_id) => {
  try {
    const contestByAdmin = await Contest.find({ created_by: user_id });
    const submissionsCount = await Promise.all(
      contestByAdmin.map(
        async ({ _id }) => await Submission.countDocuments({ contest_id: _id })
      )
    );
    const contests = contestByAdmin.map(({ name }) => name);
    return Promise.resolve({
      status: 200,
      message: "Data Found",
      contestSubmissions: { contests, submissionsCount },
    });
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
const contestsLeaderBoard = async (user_id, college_name) => {
  try {
    const college_id = await mapCollegeId(college_name);
    const students_by_colleges = await User.find({ college_id });
  } catch (error) {
    return Promise.reject({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
module.exports = { contestSubmissionsChartService };
