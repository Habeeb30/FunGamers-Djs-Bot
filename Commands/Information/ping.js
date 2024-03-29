const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const Reply = require("../../Functions/Reply");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Display this current websocket ping"),
  category: "Information",

  /**
   * @param { Client } client
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    return Reply(
      interaction,
      "⏳",
      `The current Websocket Latency is : \`${client.ws.ping} ms\``,
      false
    );
  },
};
