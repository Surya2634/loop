const { executeMachineCode } = require("../utils/tools/executeCode");
const compilerService = async (folderPath, filePath, index, flag) => {
  try {
    const output = await executeMachineCode(folderPath, filePath, index, flag);
    return Promise.resolve({
      status: 200,
      output,
      message: "Complied Successfully.",
    });
  } catch (err) {
    console.log(err);
    return Promise.reject({
      status: 500,
      err,
      message: "Error in compilation",
    });
  }
};

module.exports = { compilerService };
