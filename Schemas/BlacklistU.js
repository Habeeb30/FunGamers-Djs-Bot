const { model, Schema } = require("mongoose");

const BlacklistUser = new Schema({
  User: String,
  Reason: String,
  Time: Number,
});

module.exports = model("BlacklistU", BlacklistUser, "BlacklistUser");
