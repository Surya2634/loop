const { Schema, model } = require("mongoose");

const questionSchema = new Schema({
  name: { type: String },
  type_id: { type: Schema.Types.ObjectId, ref: "testTypes" },
  contest_id: { type: Schema.Types.ObjectId, ref: "contest" },
  quiz_id: { type: Schema.Types.ObjectId, ref: "quizzes" },
  statement: { type: String },
  description: { type: String },
  input_format: { type: String },
  output_format: { type: String },
  constraints: { type: String },
  difficulty_id: { type: Schema.Types.ObjectId, ref: "difficulties" },
  max_score: { type: Number },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("questions", questionSchema);
