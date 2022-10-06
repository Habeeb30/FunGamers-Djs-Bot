const {
  Client,
  Guild,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "guildCreate",

  /**
   * @param {Guild} guild
   * @param {Client} client
   */
  async execute(guild, client) {
    const { name, members, channels } = guild;

    let channelToSend;

    channels.cache.forEach((channel) => {
      if (
        channel.type === ChannelType.GuildText &&
        !channelToSend &&
        channel.permissionsFor(members.me).has("SendMessages")
      )
        channelToSend = channel;
    });

    if (!channelToSend) return;

    const Embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: name, iconURL: guild.iconURL() })
      .setDescription(
        "Hey, this is **FunGamers**! Thanks for inviting me to your server!"
      )
      .setFooter({
        text: "Developed By Habeeb M#0708 && Managing By Pavin#2435",
      })
      .setTimestamp();

    const Row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=924200727646195732&scope=applications.commands+bot&permissions=1099511627775"
        )
        .setLabel("Invite Me"),

      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setURL("https://dash.fungamers.xyz/")
        .setLabel("Dashboard")
    );

    channelToSend.send({ embeds: [Embed], components: [Row] });
  },
};
