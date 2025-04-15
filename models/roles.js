const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
  name: { type: String, enum: ["student", "admin", "staff"], required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("role", roleSchema);
