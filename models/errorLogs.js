const { Schema, model } = require("mongoose");

const errorLogsSchema = new Schema({
  errorLogs: [{ type: String }],
  totalLogs: { type: Number },
  created_by: { type: Schema.Types.ObjectId, ref: "users" },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

module.exports = model("errorLogs", errorLogsSchema);
