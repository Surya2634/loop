const { Schema, model } = require("mongoose");

const testTypeSchema = new Schema({
  name: { type: String, enum: ["mcq", "problem"], required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("testTypes", testTypeSchema);
