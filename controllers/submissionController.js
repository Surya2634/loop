const {
  createSubmissionService,
  getSubmissionsService,
  getAllSubmissionsService,
} = require("../services/submissionService");

const createSubmission = async (req, res) => {
  let submissionDetails = req.body;
  try {
    const { status, ...response } = await createSubmissionService(
      submissionDetails
    );
    return res.status(status).send(response);
  } catch (err) {
    //! Error in creating submission
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const getSubmission = async (req, res) => {
  const { page, limit } = req.query;
  let submissionDetails = req.body;
  try {
    const { status, ...response } = await getSubmissionsService(
      page,
      limit,
      submissionDetails
    );
    return res.status(status).send(response);
  } catch (err) {
    //! Error in getting submissions
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};
const getAllSubmissions = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const { status, ...response } = await getAllSubmissionsService(page, limit);
    return res.status(status).send(response);
  } catch (err) {
    //! Error in getting submissions
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};

module.exports = {
  createSubmission,
  getSubmission,
  getAllSubmissions,
};
