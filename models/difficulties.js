const { Schema, model } = require("mongoose");

const difficultySchema = new Schema({
  level: {
    type: String,
    enum: ["easy", "medium", "hard", "advanced", "expert"],
    required: true,
  },
});

module.exports = model("difficulty", difficultySchema);
