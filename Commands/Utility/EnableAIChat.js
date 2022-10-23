const {
  Message,
  Client,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const welcomeSchema = require("../../Schemas/AIChat");
const { model, Schema } = require("mongoose");

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

  async execute(interaction) {
    const { channel, options } = interaction;

    const welcomeChannel = options.getChannel("channel");

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

    welcomeSchema.findOne(
      { Guild: interaction.guild.id },
      async (err, data) => {
        if (!data) {
          const newWelcome = await welcomeSchema.create({
            Guild: interaction.guild.id,
            Channel: welcomeChannel.id,
          });
        }
        interaction.reply({
          content: "Successfully created AIChat System",
          ephemeral: true,
        });
      }
    );
  },
};
