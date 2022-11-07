const { Schema, model } = require("mongoose");
const verifySchema = new Schema({
  Guild: String,
  Channel: String,
  Role: String,
});

module.exports = model("verify", verifySchema, "verification");
