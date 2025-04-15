const { v4: uuidv4 } = require("uuid");
const User = require("../models/users");
const Role = require("../models/roles");
const Gender = require("../models/genders");
const Stream = require("../models/streams");
const Batch = require("../models/batches");
const Course = require("../models/courses");
const College = require("../models/colleges");
const Difficult = require("../models/difficulties");
const excel = require("exceljs");
const UUID = () => uuidv4();
const getDuration = (start, end) => {
  const days = parseInt((end - start) / (1000 * 60 * 60 * 24));
  const hours = parseInt((Math.abs(end - start) / (1000 * 60 * 60)) % 24);
  const minutes = parseInt(
    (Math.abs(end.getTime() - start.getTime()) / (1000 * 60)) % 60
  );
  const seconds = parseInt(
    (Math.abs(end.getTime() - start.getTime()) / 1000) % 60
  );
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
//* Find user by given data
const validate = async (data) => {
  try {
    let user = await User.findOne(data);
    return user;
  } catch (err) {
    console.log(err);
  }
};
const mapRoleId = async (name) => {
  try {
    let role = await Role.findOne({ name });
    return Promise.resolve(role._id);
  } catch (err) {
    return Promise.reject(err);
  }
};
const mapGenderId = async (name) => {
  try {
    let gender = await Gender.findOne({ name });
    return Promise.resolve(gender._id);
  } catch (err) {
    return Promise.reject(err);
  }
};
const mapStreamId = async (name) => {
  try {
    let stream = await Stream.findOne({ name });
    return Promise.resolve(stream._id);
  } catch (err) {
    return Promise.reject(err);
  }
};
const mapBatchId = async ([start, end]) => {
  try {
    let batch = await Batch.findOne({ start_year: +start, end_year: +end });
    if (!batch) {
      let newBatch = new Batch({ start_year: +start, end_year: +end });
      newBatch.save();
      return Promise.resolve(newBatch._id);
    }
    return Promise.resolve(batch._id);
  } catch (err) {
    return Promise.reject(err);
  }
};
const mapCourseId = async (name) => {
  try {
    let course = await Course.findOne({ name });
    return Promise.resolve(course._id);
  } catch (err) {
    return Promise.reject(err);
  }
};
const mapCollegeId = async (name) => {
  try {
    let college = await College.findOne({ name });
    return Promise.resolve(college._id);
  } catch (err) {
    return Promise.reject(err);
  }
};
const mapUserId = async (name) => {
  const user = await User.findOne({ name });
  if (user && !user.deleted_at) return user._id;
  throw "Invalid user entry";
};

const mapDifficultyId = async (level) => {
  try {
    const difficult = await Difficult.findOne({ level });
    if (difficult) return Promise.resolve(difficult._id);
    throw "Invalid difficulty level name found";
  } catch (err) {
    return Promise.reject(err);
  }
};
const setTime = (date, duration) => {
  let [days, hours, minutes, seconds] = duration.split(" ");
  days = +days.slice(0, -1);
  hours = +hours.slice(0, -1);
  minutes = +minutes.slice(0, -1);
  seconds = +seconds.slice(0, -1);
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  date.setTime(date.getTime() + minutes * 60 * 1000);
  date.setTime(date.getTime() + seconds * 1000);
  return date;
};
const exportToExcel = async (rows, username, sheetName, columns) => {
  let workbook = new excel.Workbook();
  workbook.creator = username;
  workbook.lastModifiedBy = username;
  workbook.created = new Date();
  workbook.modified = new Date();
  let worksheet = await workbook.addWorksheet(sheetName, {
    views: [{ state: "frozen", xSplit: 0, ySplit: 1 }],
  });
  worksheet.state = "visible";
  worksheet.properties.defaultColWidth = 30;
  worksheet.columns = columns;
  worksheet.addRows(rows);
  return workbook;
};
module.exports = {
  UUID,
  getDuration,
  validate,
  mapBatchId,
  mapCollegeId,
  mapCourseId,
  mapGenderId,
  mapRoleId,
  mapStreamId,
  mapUserId,
  mapDifficultyId,
  setTime,
  exportToExcel,
};
