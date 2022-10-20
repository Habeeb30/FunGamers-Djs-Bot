const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("See information about this project"),
  category: "Information",
  /**
   * @param { Client } client
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(interaction, client) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite")
        .setEmoji("📨")
        .setStyle(ButtonStyle.Link)
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=924200727646195732&scope=applications.commands+bot&permissions=4391536426743`
        ),
      new ButtonBuilder()
        .setLabel("Dashboard")
        .setEmoji("🎃")
        .setStyle(ButtonStyle.Link)
        .setURL("https://dash.fungamers.xyz/"),
      new ButtonBuilder()
        .setLabel("Support")
        .setEmoji("🆘")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/K3TGfHnvfP")
    );

    const mainPage = new EmbedBuilder()
      .setAuthor({
        name: "FunGamers",
        iconURL: "https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg",
      })
      .setThumbnail("https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg")
      .setColor(client.color)
      .addFields([
        {
          name: "Creator",
          value: "[Habeeb M](https://github.com/Habeeb30)",
        },
        {
          name: "Maintainer",
          value: "[Pavin](https://github.com/pavinrex)",
        },

        {
          name: "Mentor",
          value: "[3 LINK GAMING ™](https://discord.gg/kFj6VZMhfj)",
        },
      ]);

    return interaction.reply({ embeds: [mainPage], components: [row] });
  },
};
