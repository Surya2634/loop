const ErrorLogs = require("../models/errorLogs");

const getErrorLogsService = async (created_by, initiated_by) => {
  try {
    const errorLogs = await ErrorLogs.find({ created_by });
    if ("" + created_by != initiated_by) {
      return Promise.reject({
        status: 401,
        message: "Unauthorized",
      });
    }
    return Promise.resolve({
      status: 200,
      message: "Error logs found!",
      errorLogs,
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      message: "Unable to get error logs.",
    });
  }
};

module.exports = { getErrorLogsService };
