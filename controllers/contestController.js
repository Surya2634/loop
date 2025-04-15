const Contest = require("../models/contests");
const {
  getAllChallengesWithContestId,
} = require("../services/challengeService");
const {
  createContestService,
  updateContestService,
  getContestService,
  getAllContestWithFilter,
} = require("../services/contestService");
const { getAllQuizzesWithContestId } = require("../services/quizService");
const {
  getSessionService,
  createSessionService,
} = require("../services/sessionService");

const createContest = async (req, res) => {
  let contest = req.body;
  try {
    let { status, ...response } = await createContestService(contest);
    return res.status(status).send(response);
  } catch (err) {
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const getContest = async (req, res) => {
  const { id, code } = req.query;
  try {
    let { status, ...response } = await getContestService(
      id,
      code,
      req.user.role_id
    );
    return res.status(status).send(response);
  } catch (err) {
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const getContestForDashboard = async (req, res) => {
  const { id, code } = req.query;
  const user_id = req.user._id;
  try {
    let { status, contest } = await getContestService(
      id,
      code,
      req.user.role_id
    );
    let response = {
      contest,
      session: {},
      quizzes: [],
      challenges: [],
    };
    if (status === 200) {
      let session;
      try {
        let userSession = await getSessionService({
          user_id,
          contest_id: contest._id,
        });
        session = userSession.session;
        let now = +new Date();
        let end_date = +session.ends_at;
        if (now > end_date) {
          return res.status(403).json({ message: "Your session was expired." });
        }
      } catch (err) {
        if (err.status === 404) {
          let userSession = await createSessionService({
            user_id,
            contest_id: contest._id,
          });
          session = userSession.newSession;
        } else throw err;
      }
      response.session = session;
    }
    let contestQuizzes = await getAllQuizzesWithContestId(contest._id);
    response.quizzes = contestQuizzes.quizzes;
    let ContestChallenges = await getAllChallengesWithContestId(contest._id);
    response.challenges = ContestChallenges.challenges;
    return res
      .status(status)
      .json({ contest: response, message: "Your session is started." });
  } catch (err) {
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const updateContest = async (req, res) => {
  let updateDetails = req.body;
  try {
    let { status, ...response } = await updateContestService(updateDetails);
    return res.status(status).send(response);
  } catch (err) {
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const deleteContest = async (req, res) => {
  const contest = req.body;
  try {
    //Checking if contest already exist or softly deleted
    let exist_contest = await Contest.findOne({
      name: contest.name,
      deleted_at: null,
    });
    if (!exist_contest)
      return res.status(404).send({
        message: `No contest available to delete with name ${contest.name}`,
      });
    //TODO : Have to remove all question related to this contest
    //Softly deleted by modified deleted_at time
    await Contest.findOneAndUpdate(
      {
        name: contest.name,
        deleted_at: null,
      },
      { deleted_at: new Date() },
      { new: true }
    );
    return res.status(200).send({
      message: `Contest with name ${contest.name} deleted successfully`,
    });
  } catch (err) {
    return res.status(500).json({
      message: `Unable to delete a contest with name ${contest.name}`,
    });
  }
};
const getAllContests = async (req, res) => {
  const { page = 1, limit = 10, past } = req.query;
  try {
    let { status, ...response } = await getAllContestWithFilter(
      req.user._id,
      page,
      limit,
      past
    );
    return res.status(status).send(response);
  } catch (err) {
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};

module.exports = {
  createContest,
  updateContest,
  getContest,
  getAllContests,
  deleteContest,
  getContestForDashboard,
};
