const { Schema, model } = require("mongoose");

const answersSchema = new Schema({
  question_id: { type: Schema.Types.ObjectId, ref: "questions" },
  options: {
    type: Object,
    default: null,
    A: { type: String },
    B: { type: String },
    C: { type: String },
    D: { type: String },
    correctOption: { type: String, enum: ["A", "B", "C", "D"] },
  },
  testcases: {
    type: Object,
    default: null,
    sample: [
      {
        input: { type: String },
        output: { type: String },
      },
    ],
    hidden: [
      {
        input: { type: String },
        output: { type: String },
      },
    ],
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("answers", answersSchema);
