const { Schema, model } = require("mongoose");
const userWelcomeSchema = new Schema({
  guildId: String,
  channelId: String,
  DM: Boolean,
  DMMessage: Object,
  Content: Boolean,
  Embed: Boolean,
});

module.exports = model("welcomeSchema", userWelcomeSchema, "userJoinSchema");
