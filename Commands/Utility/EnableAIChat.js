const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const welcomeSchema = require("../../Schemas/AIChat");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-ai-chat")
    .setDescription("Set up your AIChat System.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel for welcome messages.")
        .setRequired(true)
    ),
  category: "Utility",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options } = interaction;

    const welcomeChannel = options.getChannel("channel");

    if (!guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
      interaction.reply({
        content: "I don't have permissions for this.",
        ephemeral: true,
      });
    }

    welcomeSchema.findOne({ Guild: guild.id }, async (err, data) => {
      if (!data) {
        const newWelcome = await welcomeSchema.create({
          Guild: guild.id,
          Channel: welcomeChannel.id,
        });
      }
      interaction.reply({
        content: "Successfully created Chatbot",
        ephemeral: true,
      });
    });
  },
};
