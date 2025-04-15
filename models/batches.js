const { Schema, model } = require("mongoose");

const batchSchema = new Schema({
  start_year: { type: String, required: true },
  end_year: { type: String, required: true },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("batch", batchSchema);
