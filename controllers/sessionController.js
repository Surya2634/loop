const createSession = async (req, res) => {
  const { user_id, contest_id } = req.body;
  try {
    const { status, message } = await createSessionService({
      user_id,
      contest_id,
    });
    res.status(status).send(message);
  } catch (err) {
    console.log(err);
    let { status = 500, message } = err;
    res.status(status).send(message);
  }
};
const getSession = async (req, res) => {
  const { user_id, contest_id } = req.body;
  try {
    const { status, message } = await getSessionService({
      user_id,
      contest_id,
    });
    res.status(status).send(message);
  } catch (err) {
    console.log(err);
    let { status = 500, message } = err;
    res.status(status).send(message);
  }
};
const getAllSessions = async (req, res) => {
  const { user_id, contest_id } = req.body;
  try {
    const { status, message } = await getAllSessionsService(
      user_id,
      contest_id
    );
    res.status(status).send(message);
  } catch (err) {
    console.log(err);
    let { status = 500, message } = err;
    res.status(status).send(message);
  }
};

module.exports = { createSession, getSession, getAllSessions };
