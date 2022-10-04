const {
  SlashCommandBuilder,
  Client,
  ChatInputCommandInteraction,
  ApplicationCommandOptionType,
} = require("discord.js");

const EditReply = require("../../Functions/EditReply");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("simulate")
    .setDescription("Simulate the join & leave events")
    .setDMPermission(false)
    .addStringOption((options) =>
      options
        .setName("options")
        .setDescription("Choose an option")
        .setRequired(true)
        .addChoices(
          {
            name: "Join",
            value: "join",
          },
          {
            name: "Leave",
            value: "leave",
          }
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const { options, user, member } = interaction;

    const Options = options.getString("options");

    if (user.id !== "680843929221988409")
      return EditReply(interaction, "⛔", "This command is classified!");

    switch (Options) {
      case "join":
        {
          EditReply(interaction, "✅", "Simulated Join Event");

          client.emit("guildMemberAdd", member);
        }

        break;

      case "leave":
        {
          EditReply(interaction, "✅", "Simulated Leave Event");

          client.emit("guildMemberRemove", member);
        }

        break;
    }
  },
};
