const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("report")
    .setType(ApplicationCommandType.User),
  category: "Public",

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {},
};
