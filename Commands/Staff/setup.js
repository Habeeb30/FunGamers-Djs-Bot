const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-verification")
    .setDescription("Setup the verification channel bot!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to send the verification message to.")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addStringOption((option) => {
      return option
        .setName("description")
        .setDescription("The verification systems description")
        .setRequired(false);
    })
    .addStringOption((option) => {
      return option
        .setName("title")
        .setDescription("The verification system title")
        .setRequired(false);
    }),

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    interaction.reply({
      content: "Successfully setup the verification channel!",
      ephemeral: true,
    });
  },
};
