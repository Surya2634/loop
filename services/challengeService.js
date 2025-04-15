const Question = require("../models/questions");
const { mapDifficultyId } = require("../utils/helper");
const { updateContestService } = require("./contestService");
const { getTestCasesService } = require("./testcaseService");

//IF THIS WILL BE CONTROLLER THEN USE AWAIT ONLY INSTEAD OF PROMISE
const createChallenge = async (question) => {
  //Format should be clearly defined above controller
  const { name, difficulty_id, max_score, contest_id } = question;
  try {
    //Checking if challenge already exist with same
    const challenge = await Question.findOne({ name });
    if (challenge) {
      return Promise.reject({
        status: 403,
        message: `challenge with name ${name} already exist`,
      });
    } else {
      question.difficulty_id = await mapDifficultyId(difficulty_id);
      const newChallenge = new Question(question);
      await newChallenge.save();
      await updateContestService({ id: contest_id, max_score });
      return Promise.resolve({
        status: 201,
        message: `Challenge created successfully`,
      });
    }
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: `Challenge cannot be created `,
    });
  }
};

const getChallenge = async (id, role) => {
  try {
    let question = await Question.findById(id).populate([
      {
        path: "difficulty_id",
        model: "difficulty",
        select: "level",
      },
    ]);
    if (!question) {
      return Promise.reject({
        status: 404,
        message: `Question with id ${id} had not found`,
      });
    } else {
      try {
        const { status, message, testcases } = await getTestCasesService(
          question._id,
          role
        );
        if (status === 200) {
          question = { ...question._doc, testcases };
        }
      } catch (err) {
        if (err.status !== 404) {
          throw "Error on getting testcases";
        }
      }
      return Promise.resolve({
        status: 200,
        message: `Question found`,
        question,
      });
    }
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: `Can't get the question.`,
    });
  }
};

const updateChallenge = async (question) => {
  const { id, max_score, contest_id } = question;
  try {
    const exist_question = await Question.findById(id);
    if (!exist_question) {
      return Promise.resolve({
        status: 404,
        message: `Question not found`,
      });
    } else {
      if (question.name) {
        const questionWithNewName = await Question.findOne({
          name: question.name,
        });
        if (
          questionWithNewName &&
          JSON.stringify(questionWithNewName._id) !== JSON.stringify(id)
        ) {
          return Promise.reject({
            status: 403,
            message: `Question name not available.`,
          });
        }
      }
      if (question.difficulty_id)
        question.difficulty_id = await mapDifficultyId(question.difficulty_id);
      if (question.type_id) delete question["type_id"];

      if (max_score)
        await updateContestService({
          max_score: max_score - exist_question.max_score,
          id: contest_id,
        });

      await Question.findByIdAndUpdate(id, {
        ...question,
        update_at: new Date(),
      });
      return Promise.resolve({
        status: 200,
        message: `Question updated successfully`,
      });
    }
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: `Can't update the question.`,
    });
  }
};

const getAllChallengesWithContestId = async (id) => {
  try {
    const challenges = await Question.find({ contest_id: id }).populate({
      path: "difficulty_id",
      model: "difficulty",
      select: "level",
    });
    if (challenges) {
      return Promise.resolve({
        status: 200,
        message: `Challenges that are available`,
        challenges,
      });
    } else {
      return Promise.reject({
        status: 404,
        message: `Challenges not available`,
      });
    }
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: `Error in getting challenges for contest id ${id}`,
    });
  }
};
const deleteChallenge = async ({ _id }) => {
  try {
    const { max_score, contest_id } = await Question.findByIdAndDelete(_id);
    if (!max_score || !contest_id)
      return Promise.reject({ status: 404, message: `Challenge not found` });
    await updateContestService({ max_score: -max_score, id: contest_id });
    return Promise.resolve({
      status: 202,
      message: `Challenge deleted successfully`,
    });
  } catch (err) {
    return Promise.reject({
      status: 500,
      message: `Internal server error`,
    });
  }
};
module.exports = {
  createChallenge,
  getChallenge,
  getAllChallengesWithContestId,
  updateChallenge,
  deleteChallenge,
};
