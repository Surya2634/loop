const { updateQuizService } = require("../services");
const {
  createQuizService,
  getQuizService,
  getAllQuizzesWithContestId,
  deleteQuizService,
} = require("../services/quizService");

const createQuiz = async (req, res) => {
  let { name, contest_id } = req.body;
  try {
    const { status, ...response } = await createQuizService(name, contest_id);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in creating quiz
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const getQuiz = async (req, res) => {
  let { id } = req.query;
  try {
    const { status, ...response } = await getQuizService(id);
    res.status(status).send(response);
  } catch (err) {
    //! Error in getting quiz
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const updateQuiz = async (req, res) => {
  let quiz = req.body;
  try {
    const { status, ...response } = await updateQuizService(quiz);
    res.status(status).send(response);
  } catch (err) {
    //! Error in updating quiz
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const deleteQuiz = async (req, res) => {
  let quiz = req.body;
  try {
    const { status, ...response } = await deleteQuizService(quiz);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in deleting quiz
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const getAllQuizzes = async (req, res) => {
  const { id } = req.query;
  try {
    const { status, ...response } = await getAllQuizzesWithContestId(id);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in getting quizzes with contest id
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
module.exports = {
  createQuiz,
  getQuiz,
  updateQuiz,
  getAllQuizzes,
  deleteQuiz,
};
