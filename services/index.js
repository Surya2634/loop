const Quiz = require("../models/quizzes");
const { updateContestService } = require("./contestService");

const updateQuizService = async ({ id, name, total_mcqs, contest_id }) => {
  try {
    let quiz = await Quiz.findById(id);
    if (!quiz) {
      return Promise.reject({
        status: 404,
        message: `${name} Quiz not found.`,
      });
    } else {
      if (name) quiz.name = name;
      if (total_mcqs) {
        quiz.total_mcqs = quiz.total_mcqs + total_mcqs;
        await updateContestService({
          id: quiz.contest_id,
          max_score: total_mcqs,
        });
      }
      if (contest_id) quiz.contest_id = contest_id;
      await quiz.save();
      return Promise.resolve({
        status: 200,
        message: "Quiz updated",
      });
    }
  } catch (err) {
    console.log(err);
    //! Error in updating quiz
    return Promise.reject({
      status: 500,
      message: `Error in updating Quiz`,
    });
  }
};
module.exports = {
  updateQuizService,
};
