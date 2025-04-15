const User = require("../models/users");
const { SECRET } = require("../config/index");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { serializeUser } = require("../utils/Auth");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

module.exports = (passport) => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      try {
        let user = await User.findById(payload.user_id).populate([
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
        user = serializeUser(user);
        user && !user.deleted_at ? done(null, { ...user }) : done(null, false);
      } catch (err) {
        done(null, false);
      }
    })
  );
};
