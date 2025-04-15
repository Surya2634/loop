const { Schema, model } = require("mongoose");

const submissionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "user" },
  contest_id: { type: Schema.Types.ObjectId, ref: "contest" },
  score: { type: Number, default: 0 },
  created_at: { type: Date, default: new Date() },
});

module.exports = model("submission", submissionSchema);
