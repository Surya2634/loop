const { Schema, model } = require("mongoose");

const loginSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  ip_address: { type: String },
  system_name: { type: String },
  location: { type: String },
  login_timeStamp: { type: Date },
  logout_timeStamp: { type: Date, default: null },
  previouslyLoggedIn: {
    type: Schema.Types.ObjectId,
    ref: "login",
    default: null,
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("login", loginSchema);
