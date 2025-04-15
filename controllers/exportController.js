const fs = require("fs");
const path = require("path");
const Submission = require("../models/submissions");
const User = require("../models/users");
const {
  exportToExcel,
  mapRoleId,
  mapStreamId,
  mapCourseId,
  mapCollegeId,
  mapBatchId,
  mapGenderId,
} = require("../utils/helper");
const exportSubmissions = async (req, res) => {
  const { contest_id } = req.body;
  try {
    const submissions = await Submission.find({ contest_id })
      .sort({ score: "desc", created_at: "asc" })
      .populate({
        path: "user_id",
        model: "users",
        select: "name regno",
      });

    const rows = submissions.map((submission) => [
      submission.user_id.regno,
      submission.user_id.name,
      new Date(submission.created_at).toLocaleString(),
      submission.score,
    ]);
    const columns = [
      { header: "Register No", key: "Register No", width: 20 },
      { header: "Name", key: "Name", width: 20 },
      { header: "Submitted at", key: "Submitted at", width: 20 },
      { header: "score", key: "score", width: 20 },
    ];
    const username = req.user.name;
    const workbook = await exportToExcel(
      rows,
      username,
      `${contest_id}`,
      columns
    );
    res.set({
      "Content-disposition": `attachment;filename=${username}.xlsx`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    await workbook.xlsx.write(res);
    return res.status(200).json({ message: "File Downloaded Successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error in downloading submissions details" });
  }
};
const exportUsers = async (req, res) => {
  try {
    let { queries = {} } = req.body;
    queries.role_id = await mapRoleId("student");
    if (queries.stream_id)
      queries.stream_id = await mapStreamId(queries.stream_id);
    if (queries.course_id)
      queries.mapCourseId = await mapCourseId(queries.mapCourseId);
    if (queries.college_id)
      queries.college_id = await mapCollegeId(queries.college_id);
    if (queries.batch_id) queries.batch_id = await mapBatchId(queries.batch_id);
    if (queries.gender_id)
      queries.gender_id = await mapGenderId(queries.gender_id);
    const users = await User.find(queries)
      .sort({ regno: "asc" })
      .populate([
        {
          path: "role_id",
          model: "role",
          select: "name",
        },
        {
          path: "gender_id",
          model: "gender",
          select: "name",
        },
        {
          path: "stream_id",
          model: "stream",
          select: "name",
        },
        {
          path: "course_id",
          model: "course",
          select: "name",
        },
        {
          path: "college_id",
          model: "college",
          select: "name",
        },
        {
          path: "batch_id",
          model: "batch",
          select: "start_year end_year",
        },
      ]);
    const rows = users.map(
      ({
        regno,
        name,
        email,
        gender_id,
        stream_id,
        course_id,
        college_id,
        batch_id,
        phone_no,
      }) => [
        regno ?? "",
        name ?? "",
        email ?? "",
        gender_id?.name ?? "",
        stream_id?.name ?? "",
        `${batch_id?.start_year}-${batch_id?.end_year}` ?? "",
        course_id?.name ?? "",
        college_id?.name ?? "",
        phone_no ?? "",
      ]
    );
    const columns = [
      { header: "Register No", key: "Register No", width: 20 },
      { header: "Name", key: "Name", width: 20 },
      { header: "Email", key: "Email", width: 20 },
      { header: "Gender", key: "Gender", width: 20 },
      { header: "Stream", key: "Stream", width: 20 },
      { header: "Batch", key: "Batch", width: 20 },
      { header: "Course", key: "Course", width: 20 },
      { header: "College", key: "College", width: 20 },
      { header: "Phone number", key: "Phone number", width: 20 },
    ];
    const username = req.user.name;
    const workbook = await exportToExcel(
      rows,
      username,
      "UsersDetails",
      columns
    );
    res.set({
      "Content-disposition": `attachment;filename=${username}.xlsx`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    await workbook.xlsx.write(res);
    return res.status(200).json({ message: "File Downloaded Successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error in downloading users details" });
  }
};
const exportSampleUsersDetails = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "/../bulk_upload.xlsx");
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File Not Found" });
    }
    return res.status(200).sendFile(filePath);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Error in downloading users details" });
  }
};
module.exports = { exportSubmissions, exportUsers, exportSampleUsersDetails };
