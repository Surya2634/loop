const TestType = require("../models/testTypes");
const Question = require("../models/questions");
const {
  createMCQ,
  getMCQ,
  updateMCQ,
  getAllMcqWithQuizID,
  deleteMCQ,
} = require("../services/mcqService");
const {
  createChallenge,
  getChallenge,
  updateChallenge,
  getAllChallengesWithContestId,
  deleteChallenge,
} = require("../services/challengeService");
const { encryption } = require("../utils/crypto-js");

const createQuestion = async (req, res) => {
  let questionDetails = req.body;
  let functions = [createMCQ, createChallenge],
    index;
  if (questionDetails.type_id === "mcq") index = 0;
  else if (questionDetails.type_id === "problem") index = 1;
  try {
    questionDetails.type_id = (
      await TestType.findOne({ name: questionDetails.type_id })
    )._id;
    let { status, ...response } = await functions[index](questionDetails);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in creating question
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const getQuestion = async (req, res) => {
  let { type, id } = req.query;
  let functions = [getMCQ, getChallenge],
    index;
  if (type === "mcq") index = 0;
  else if (type === "problem") index = 1;
  try {
    let { status, ...response } = await functions[index](id, req.user.role_id);
    response = encryption(response);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in getting question
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).send(encryption({ message }));
  }
};
const updateQuestion = async (req, res) => {
  let questionDetails = req.body;
  let { type } = req.query;
  let functions = [updateMCQ, updateChallenge],
    index;
  if (type === "mcq") index = 0;
  else if (type === "problem") index = 1;
  try {
    let { status, ...response } = await functions[index](questionDetails);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in updating question
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const deleteQuestion = async (req, res) => {
  let questionDetails = req.body;
  let { type } = req.query;
  let functions = [deleteMCQ, deleteChallenge],
    index;
  if (type === "mcq") index = 0;
  else if (type === "problem") index = 1;
  try {
    let { status, ...response } = await functions[index](questionDetails);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in updating question
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const getAllMCQS = async (req, res) => {
  let { id, page = 1, limit } = req.query;
  let flag = req.user.role_id === "admin";
  limit = flag ? 10 : 1;
  try {
    let { status, ...response } = await getAllMcqWithQuizID(
      id,
      page,
      limit,
      flag
    );
    response = encryption(response);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in getting mcqs with quiz id
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const getAllChallenges = async (req, res) => {
  const { id } = req.query;
  try {
    let { status, ...response } = await getAllChallengesWithContestId(id);
    response = encryption(response);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in getting challenges with contest id
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};

module.exports = {
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getAllMCQS,
  getAllChallenges,
};
