const Contest = require("../models/contests");
const Submission = require("../models/submissions");
const { getDuration, UUID } = require("../utils/helper");

const createContestService = async (contest) => {
  try {
    //Can we write it as reusable
    //Checking for name of contest was already taken
    const exist_contest = await Contest.findOne({
      name: contest.name,
      deleted_at: null,
    });
    if (exist_contest) {
      return Promise.reject({
        status: 403,
        message: "Contest name already taken",
      });
    }
    //* Creating new contest with given details
    else {
      const uuid = UUID().split("-").pop();
      contest.code = uuid.substring(uuid.length - 6, uuid.length).toUpperCase();
      //* Start datetime & End datetime of the contest
      let start = new Date(contest.start_date + " " + contest.start_time);
      let end = new Date(contest.end_date + " " + contest.end_time);
      contest.start_date = start;
      contest.end_date = end;
      //* Calculating duration
      contest.duration = getDuration(start, end);
      //** <- end*/
      const newContest = new Contest(contest);
      await newContest.save();
      return Promise.resolve({
        status: 201,
        message: "Contest created successfully",
      });
    }
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: "Can't create contest",
    });
  }
};
const getContestService = async (id, code, role_id) => {
  try {
    //If contest already exist return success otherwise not found
    let contest;
    if (id) contest = await Contest.findById(id);
    else if (code) contest = await Contest.findOne({ code });
    if (!contest) {
      return Promise.reject({
        status: 404,
        message: "Contest not found",
      });
    }
    if (role_id === "student") {
      let now = +new Date();
      let end_date = +contest.end_date;
      let start_date = +contest.start_date;
      //* If the contest was already ended.
      if (now > end_date) {
        return Promise.reject({
          status: 403,
          message: "The contest was expired.",
        });
      }
      //* If the contest is not started yet.
      if (now < start_date) {
        return Promise.reject({
          status: 403,
          message: "The contest is not started yet.",
        });
      }
    }
    return Promise.resolve({
      status: 200,
      contest,
      message: "Contest found",
    });
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: "Unable to find contest.",
    });
  }
};
const updateContestService = async ({
  id,
  name,
  start_date,
  end_date,
  start_time,
  end_time,
  max_score,
}) => {
  try {
    let contest = await Contest.findById(id);
    if (!contest)
      return Promise.reject({
        status: 404,
        message: "Contest not found",
      });
    if (max_score) {
      contest.max_score += +max_score;
    }
    if (name) {
      let contestNameExists = await Contest.findOne({ name });
      if (
        contestNameExists &&
        JSON.stringify(contest._id) !== JSON.stringify(contestNameExists._id)
      )
        return Promise.reject({
          status: 403,
          message: `Contest name ${name} already taken`,
        });
      contest.name = name;
    }
    if (start_time || start_date || end_date || end_time) {
      if (start_time) contest.start_time = start_time;
      if (!start_date) {
        let date = contest.start_date;
        start_date = `${
          date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}`;
      }
      contest.start_date = new Date(start_date + " " + contest.start_time);

      if (end_time) contest.end_time = end_time;
      if (!end_date) {
        let date = contest.end_date;
        end_date = `${
          date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}`;
      }
      contest.end_date = new Date(end_date + " " + contest.end_time);

      //* Calculating duration
      contest.duration = getDuration(contest.start_date, contest.end_date);
    }
    await contest.save();
    return Promise.resolve({
      status: 200,
      message: "Contest updated.",
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: "Unable to find contest.",
    });
  }
};
const getAllContestWithFilter = async (created_by, page, limit, past) => {
  try {
    let ongoingContests = [];
    let upcomingContests = [];
    //**past contests */
    const pastContestsCount = await Contest.find({
      end_date: { $lte: new Date() },
      created_by,
    }).countDocuments();
    let pastContests = await Contest.find({
      end_date: { $lte: new Date() },
      created_by,
    })
      .sort({ start_date: "desc" })
      .limit(limit * 1)
      .skip((page > 0 ? page - 1 : 1) * limit);
    pastContests = await Promise.all(
      pastContests.map(async (contest) => {
        const submissionsCount = await Submission.countDocuments({
          contest_id: contest._id,
        });
        return { ...contest._doc, submissionsCount };
      })
    );
    //**ongoing contests */
    if (past === "false") {
      ongoingContests = await Contest.find({
        start_date: { $lte: new Date() },
        end_date: { $gte: new Date() },
        created_by,
      }).sort();
      //**upcoming contests */
      upcomingContests = await Contest.find({
        start_date: { $gte: new Date() },
        created_by,
      }).sort({ start_date: "asc" });
    }
    //**promise result */
    return Promise.resolve({
      status: 200,
      message: "Contests found",
      data: {
        pastContestsCount,
        pastContests,
        ongoingContests,
        upcomingContests,
      },
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: `Internal Server Error`,
    });
  }
};
const getAllContestService = async (page, limit) => {
  try {
    let response = {};
    const count = await Contest.countDocuments();
    response.modelCount = count;
    //get all contest and return , return nothing if nothing
    const contests = await Contest.find({ deleted_at: null })
      .limit(limit * 1)
      .skip((page > 0 ? page - 1 : 1) * limit);
    response.total = contests.length;
    response.contests = contests;
    return Promise.resolve({
      status: 200,
      message: response,
    });
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: "Unable to find any contests",
    });
  }
};
module.exports = {
  createContestService,
  getContestService,
  updateContestService,
  getAllContestService,
  getAllContestWithFilter,
};
