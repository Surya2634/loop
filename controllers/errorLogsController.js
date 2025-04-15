const { getErrorLogsService } = require("../services/errorLogsService");

const getErrorLogs = async (req, res) => {
  const { created_by } = req.query;
  try {
    const { status, ...response } = await getErrorLogsService(
      created_by,
      req.user._id
    );
    return res.status(status).send(response);
  } catch (err) {
    console.log(err);
    let { status = 500, message } = err;
    return res.status(status).json({ message });
  }
};

module.exports = { getErrorLogs };
