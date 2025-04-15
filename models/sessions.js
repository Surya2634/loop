const { Schema, model } = require("mongoose");

const sessionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "users", required: true },
  contest_id: { type: Schema.Types.ObjectId, ref: "contests", required: true },
  starts_at: { type: Date },
  ends_at: { type: Date },
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("sessions", sessionSchema);
