const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  regno: { type: String },
  name: { type: String },
  email: { type: String },
  password: { type: String, required: true },
  role_id: { type: Schema.Types.ObjectId, ref: "role" },
  gender_id: { type: Schema.Types.ObjectId, ref: "gender" },
  stream_id: { type: Schema.Types.ObjectId, ref: "stream" },
  batch_id: { type: Schema.Types.ObjectId, ref: "batch" },
  course_id: { type: Schema.Types.ObjectId, ref: "course" },
  college_id: { type: Schema.Types.ObjectId, ref: "college" },
  phone_no: { type: Number },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("users", userSchema);
