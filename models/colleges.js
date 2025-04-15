const { Schema, model } = require("mongoose");

const collegeSchema = new Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("college", collegeSchema);
