const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const AI = require("../../Schemas/AIChat");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-ai-chat")
    .setDescription("Set up your AI Chat System.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel for chat messages.")
        .setRequired(true)
    ),
  category: "Utility",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(interaction) {
    const { guild, options } = interaction;

    const chatChannel = options.getChannel("channel");

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.SendMessages
      )
    ) {
      interaction.reply({
        content: "I don't have permissions for this.",
        ephemeral: true,
      });
    }

    AI.findOne({ Guild: guild.id }, async (err, data) => {
      if (!data) {
        const newWelcome = await AI.create({
          Guild: guild.id,
          Channel: chatChannel.id,
        });
      }
      interaction.reply({
        content: "Successfully created AIChat System",
        ephemeral: true,
      });
    });
  },
};
