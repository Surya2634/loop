const { Schema, model } = require("mongoose");

const contestSchema = new Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  start_date: { type: Date },
  end_date: { type: Date },
  start_time: { type: String },
  end_time: { type: String },
  duration: { type: String },
  max_score: { type: Number, default: 0 },
  created_by: { type: Schema.Types.ObjectId, ref: "users" },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("contest", contestSchema);
