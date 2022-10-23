const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription(
      "Displays the status of the client and database connection."
    ),
    category: "Information",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const Response = new EmbedBuilder()
      .setColor(0x0099ff)
      .setAuthor({
        name: interaction.user.tag,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .addFields(
        {
          name: "Client",
          value: `Username: \`${
            client.user.tag
          }\`\nLibrary: [discord.js](https://discord.js.org/)\nPing: \`${Math.round(
            client.ws.ping
          )}ms\`\nUptime: <t:${parseInt(client.readyTimestamp / 1000)}:R>`,
        },
        {
          name: "Stats",
          value: `Commands: \`${client.commands.size} commands\`\nGuilds: \`${client.guilds.cache.size} guilds\`\nUsers: \`${client.users.cache.size} users\``,
          inline: false,
        },
        {
          name: "Database",
          value: `🟢 CONNECTED\``,
          inline: false,
        }
      )
      .setTimestamp();

    interaction.reply({ embeds: [Response] });
  },
};
