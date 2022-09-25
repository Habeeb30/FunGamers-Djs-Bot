const { model, Schema } = require("mongoose");

const BlacklistGuild = new Schema({
  Guild: String,
  Reason: String,
  Time: Number,
});

module.exports = model("BlacklistG", BlacklistGuild, "BlacklistGuild");
