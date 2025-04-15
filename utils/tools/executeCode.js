const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const generateMachineCode = (folderPath, filePath) => {
  const [fileId, fileFormat] = path.basename(filePath).split(".");
  let command = ``;
  if (fileFormat === "c") {
    command = `gcc ${filePath} -o ${folderPath}/${fileId}`;
  } else if (fileFormat === "java") {
    command = `javac ${filePath}`;
  }
  return new Promise((resolve, reject) => {
    exec(
      command,
      { maxBuffer: 1024 * 1024, timeout: 10000 },
      (error, stdout, stderr) => {
        if (error) {
          if (error.signal === "SIGTERM") reject(["Request Timeout"]);
          stderr = stderr.split(filePath);
          stderr = stderr
            .filter((err) => err !== "")
            .map((err) => `Main ${err}`);
          stderr.code = error.code;
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};
const executeMachineCode = (folderPath, filePath, index, flag) => {
  const [fileId, fileFormat] = path.basename(filePath).split(".");
  let command = ``;
  if (fileFormat === "c") {
    if (flag)
      command = `${folderPath}/${fileId} a.exe < ${path.join(
        folderPath,
        `input${index}.txt`
      )}`;
    else {
      command = `${folderPath}/${fileId} a.exe`;
    }
  } else if (fileFormat === "java") {
    if (flag)
      command = `java -cp ${folderPath} Main < ${path.join(
        folderPath,
        `input${index}.txt`
      )}`;
    else command = `java -cp ${folderPath} Main`;
  }
  return new Promise((resolve, reject) => {
    exec(
      command,
      { maxBuffer: 1024 * 1024, timeout: 10000 },
      (error, stdout, stderr) => {
        if (error) {
          if (error.signal === "SIGTERM") reject(["Request Timeout"]);
          stderr = stderr.split(filePath);
          stderr = stderr
            .filter((err) => err !== "")
            .map((err) => `Main ${err}`);
          stderr.code = error.code;
          reject(stderr);
        }
        resolve(stdout);
      }
    );
  });
};
const removeFolder = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.rm(folderPath, { recursive: true }, (err) => {
      if (err) console.log(err);
    });
  }
};
module.exports = {
  generateMachineCode,
  executeMachineCode,
  removeFolder,
};
