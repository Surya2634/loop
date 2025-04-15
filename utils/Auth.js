const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { SECRET } = require("../config/index");
const User = require("../models/users");
const Role = require("../models/roles");

//? User Login
const userLogin = async (req, res) => {
  let { encryptedData } = req.body;
  let userCred = decryption(encryptedData);
  let { regno, password } = userCred;
  //? Check if the regno is in the DB
  try {
    const user = await User.findOne({ regno });
    if (!user || user.deleted_at) {
      //! Register Number not found
      return res.status(404).json({
        message: "Register number not found!",
      });
    }
    const role = await Role.findById(user.role_id);
    //? If user exists
    let isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = jwt.sign(
        {
          user_id: user._id,
          role: role.name,
          regno: user.regno,
          email: user.email,
        },
        SECRET,
        { expiresIn: "12h" }
      );
      let result = {
        username: user.name,
        role: role.name,
        email: user.email,
        token: `Bearer ${token}`,
        expiresIn: 12,
      };
      return res.status(200).send(
        encryption({
          ...result,
          message: "You are logged in!",
        })
      );
    } else {
      //! Wrong password
      return res.status(403).send({
        message: "Incorrect password.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
//? Passport Middleware
const userAuth = passport.authenticate("jwt", { session: false });
const { API } = require("./api");
const { decryption, encryption } = require("./crypto-js");
const routeAuth = (controller) => (req, res, next) => {
  API[req.user.role_id].find((api) => api === controller)
    ? next()
    : res.status(401).json({
        message: `Unauthorized access`,
      });
};

const serializeUser = (user) => {
  let userDetails = {};
  userDetails._id = user._id;
  userDetails.regno = user.regno;
  userDetails.name = user.name;
  userDetails.email = user.email;
  userDetails.role_id = user.role_id?.name;
  userDetails.gender_id = user.gender_id?.name;
  userDetails.stream_id = user.stream_id?.name;
  userDetails.college_id = user.college_id?.name;
  userDetails.course_id = user.course_id?.name;
  userDetails.phone_no = user.phone_no;
  if (user.batch_id)
    userDetails.batch_id = `${user.batch_id.start_year}-${user.batch_id.end_year}`;
  return userDetails;
};

module.exports = {
  userAuth,
  userLogin,
  serializeUser,
  routeAuth,
};
