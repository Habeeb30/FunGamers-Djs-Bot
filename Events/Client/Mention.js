const {
  Client,
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "messageCreate",

  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    const { author, guild, content } = message;
    const { user } = client;

    if (!guild || author.bot) return;
    if (content.includes("@here") || content.includes("@everyone")) return;
    if (!content.includes(user.id)) return;

    return message
      .reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
              name: user.username,
              iconURL: user.displayAvatarURL(),
            })
            .setDescription(
              `Hey, you called me? I'm FunGamers! Nice to meet you. type \`/\` & click on my logo to see all my commands!
              \n\n*This message will be deleted in \`20 seconds\`!*`
            )
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: "Introduction to FunGamers" })
            .setTimestamp(),
        ],

        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setURL(
                "https://discord.com/api/oauth2/authorize?client_id=924200727646195732&permissions=8&scope=bot%20applications.commands"
              )
              .setLabel("Invite Me"),

            new ButtonBuilder()
              .setStyle(ButtonStyle.Link)
              .setURL("https://youtube.com/FUNGAMERS-FG")
              .setLabel("Dashboard")
          ),
        ],
      })
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((err) => {
            if (err.code !== 10008) return console.log(err);
          });
        }, ms("20s"));
      });
  },
};
