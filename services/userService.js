const bcrypt = require("bcryptjs");
const User = require("../models/users");
let {
  validate,
  mapBatchId,
  mapCollegeId,
  mapCourseId,
  mapGenderId,
  mapRoleId,
  mapStreamId,
} = require("../utils/helper");
const createUserService = async (userDetails) => {
  let regno = userDetails.regno;
  try {
    //* Validate register number
    let registerNumberNotTaken = await validate({ regno });
    if (registerNumberNotTaken) {
      return Promise.reject({
        status: 403,
        message: `Register number already exists.`,
        regno,
      });
    }
    //* Get the hashed password
    if (!userDetails.password) {
      let suffix = "";
      if (userDetails.college_id === "KSR College of Engineering")
        suffix = "@ksrce";
      else if (userDetails.college_id === "KSR College of Technology")
        suffix = "@ksrct";
      else if (
        userDetails.college_id === "KSR Institute for Engineering & Technology"
      )
        suffix = "@ksriet";
      userDetails.password = `${userDetails.regno}${suffix}`;
      let hashedPassword = await bcrypt.hash(userDetails.password, 8);
      userDetails.password = hashedPassword;
    } else {
      let hashedPassword = await bcrypt.hash(userDetails.password, 8);
      userDetails.password = hashedPassword;
    }
    //* Map IDs
    if (userDetails.role_id === "admin")
      userDetails.role_id = await mapRoleId("admin");
    else userDetails.role_id = await mapRoleId("student");
    if (userDetails.gender_id)
      userDetails.gender_id = await mapGenderId(userDetails.gender_id);
    if (userDetails.stream_id)
      userDetails.stream_id = await mapStreamId(userDetails.stream_id);
    if (userDetails.batch_id)
      userDetails.batch_id = await mapBatchId(userDetails.batch_id.split("-"));
    if (userDetails.course_id)
      userDetails.course_id = await mapCourseId(userDetails.course_id);
    if (userDetails.college_id)
      userDetails.college_id = await mapCollegeId(userDetails.college_id);
    //* Create new user
    const newUser = new User({ ...userDetails });
    await newUser.save();
    return Promise.resolve({
      status: 201,
      message: `New user created.`,
    });
  } catch (err) {
    //! Error in creating user
    console.log(err);
    return Promise.reject({
      status: 500,
      message: `Error in creating user.`,
    });
  }
};
module.exports = {
  createUserService,
};
