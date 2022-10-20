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
        .setURL("https://discord.gg/K3TGfHnvfP"),
      new ButtonBuilder()
        .setLabel("VoteUs")
        .setEmoji("🗳")
        .setStyle(ButtonStyle.Link)
        .setURL("https://top.gg/bot/924200727646195732")
    );

    const mainPage = new EmbedBuilder()
      .setAuthor({
        name: "FunGamers",
        iconURL: "https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg",
      })
      .setThumbnail("https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg")
      .setColor(client.color)
      .setTitle("Information about this project")
      .setDescription(
        "Hello guys happy to announce This is our multi function discord bot kindly add to your servers [Invite Link](https://dash.fungamers.xyz/invite)\n\n**--------------✦Futures and Options✦-------------**\n> **Welcome&LeaveSystem :** Set In Dashboard,\n> **LoggingSystem :** Set In Dashboard,\n> **TicketSystem :** Work In Progress,\n> **VerificationSystem :** </setup-verification:1022429140244254791> </setrole-verification:1022429140244254790>,\n> **ModerationSystem :** </timeout:1026375069498359828> Adding More In Future,\n> **GiveawaySystem :** </giveaway create:1006884784162754620> </giveaway manage:1006884784162754620>,\n> **ReportUserSystem :** Right Click the user => Apps => Report User,\n> **Purge Command :** aka ~~Clear Command~~ </purge all:1028739736875040878> </purge user:1028739736875040878> </purge bot:1028739736875040878>,\n> And some fun commands like </fact:1014792013411000330> </image alert:1011164373454159902> </image biden:1011164373454159902> </image car:1011164373454159902> </image caution:1011164373454159902> </remind:1022415941373534248> </vote-kick:1011230446266372146> </serverinfo:1026442406289227846>\n\n**--------------✦EMAILS✦-------------**\n``support@fungamers.xyz`` = For Support\n``sponsorto@fungamers.xyz`` = For Sponsors\n``contact@fungamers.xyz`` = For Contact\n"
      )
      .addFields([
        {
          name: "Creator",
          value: "[Habeeb M](https://github.com/Habeeb30)",
          inline: true,
        },
        {
          name: "Maintainer",
          value: "[Pavin](https://github.com/pavinrex)",
          inline: true,
        },

        {
          name: "Mentor",
          value: "[3 LINK GAMING ™](https://discord.gg/kFj6VZMhfj)",
          inline: true,
        },
      ]);

    return interaction.reply({ embeds: [mainPage], components: [row] });
  },
};
