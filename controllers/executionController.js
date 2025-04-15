const {
  createExecutionService,
  getExecutionService,
  updateExecutionService,
} = require("../services/executionService");

const createExecution = async (req, res) => {
  const { contest_id, question_id, code } = req.body;
  const user_id = req.user._id;
  const role_id = req.user.role_id;
  try {
    const { status, ...response } = await createExecutionService({
      user_id,
      contest_id,
      question_id,
      code,
      role_id,
    });
    return res.status(status).send(response);
  } catch (e) {
    console.log(err);
    let { status = 500, ...response } = err;
    return res.status(status).send(response);
  }
};

const getExecution = async (req, res) => {
  const id = req.query.id;
  try {
    const { status, ...response } = await getExecutionService(id);
    return res.status(status).send(response);
  } catch (e) {
    console.log(err);
    let { status = 500, ...response } = err;
    return res.status(status).send(response);
  }
};
const updateExecution = async (req, res) => {
  const { id, code } = req.body;
  try {
    const { status, ...response } = await updateExecutionService(id, code);
    return res.status(status).send(response);
  } catch (e) {
    console.log(err);
    let { status = 500, ...response } = err;
    return res.status(status).send(response);
  }
};

module.exports = {
  createExecution,
  getExecution,
  updateExecution,
};
