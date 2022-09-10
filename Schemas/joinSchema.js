const { Schema, model } = require("mongoose");
const userWelcomeSchema = new Schema({
  guildId: String,
  channelId: String,
});

module.exports = model("welcomeSchema", userWelcomeSchema, "userJoinSchema");
