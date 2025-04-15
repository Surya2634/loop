const { Schema, model } = require("mongoose");

const genderSchema = new Schema({
  name: {
    type: String,
    enum: ["male", "female", "others"],
    required: true,
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("gender", genderSchema);
