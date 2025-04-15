const { Schema, model } = require("mongoose");

const executionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "users" },
  contest_id: { type: Schema.Types.ObjectId, ref: "contests" },
  question_id: {
    type: Schema.Types.ObjectId,
    ref: "questions",
    required: true,
  },
  code: { type: String },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("execution", executionSchema);
