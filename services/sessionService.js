const Session = require("../models/sessions");
const Contest = require("../models/contests");
const createSessionService = async ({ user_id, contest_id }) => {
  try {
    let contest = await Contest.findById(contest_id);
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
    let starts_at = new Date();
    let ends_at = contest.end_date;
    // if (contest.duration) ends_at = setTime(new Date(), contest.duration);
    let newSession = new Session({ user_id, contest_id, starts_at, ends_at });
    await newSession.save();
    return Promise.resolve({
      status: 201,
      message: "Session create successfully.",
      newSession,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: "Error in creating session.",
    });
  }
};
const getSessionService = async (sessionDetails) => {
  try {
    let session = await Session.findOne(sessionDetails);
    if (!session)
      return Promise.reject({
        status: 404,
        message: "Session not found!",
      });
    return Promise.resolve({
      status: 200,
      message: "Session found.",
      session,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: "Error in getting session.",
    });
  }
};
const updateSessionService = async (contest_id, user_id, ends_at) => {
  try {
    let session = await Session.findOne({ contest_id, user_id });
    if (!session)
      return Promise.reject({
        status: 404,
        message: "Session not found!",
      });
    session.ends_at = ends_at;
    await session.save();
    return Promise.resolve({
      status: 200,
      message: "Session updated.",
      session,
    });
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: "Error in getting session.",
    });
  }
};
const getAllSessionsService = async (session, page, limit) => {
  let response = {};
  try {
    response.modelCount = await Session.countDocuments();
    let sessions = await Session.find(session)
      .populate({
        path: "contest_id",
        model: "contest",
      })
      .limit(limit * 1)
      .skip((page > 0 ? page - 1 : 1) * limit);
    response.total = sessions.length;
    response.sessions = sessions;
    return Promise.resolve({
      status: 200,
      message: `sessions found!`,
      response,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: "Error in getting all sessions.",
    });
  }
};

module.exports = {
  createSessionService,
  getSessionService,
  updateSessionService,
  getAllSessionsService,
};
