const {
  Client,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Avatar")
    .setType(ApplicationCommandType.User),
  category: "Context",

  /**
   * @param {ContextMenuCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const { guild, targetId } = interaction;

    const target = await guild.members.cache.get(targetId);

    const Embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `${target.user.username}'s Avatar`,
        iconURL: target.user.displayAvatarURL(),
      })
      .setImage(target.user.displayAvatarURL({ size: 512 }))
      .setFooter({ text: "Avatar by FunGamers" })
      .setTimestamp();

    return interaction.editReply({ embeds: [Embed] });
  },
};
