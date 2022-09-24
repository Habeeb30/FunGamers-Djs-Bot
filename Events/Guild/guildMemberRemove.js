const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const leaveSchema = require("../../Schemas/leaveSchema");

module.exports = {
  name: "guildMemberRemove",

  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const { user, guild } = member;

    const Data = await leaveSchema
      .findOne({ guildId: guild.id })
      .catch((err) => {});
    if (!Data) return;

    if (Data.channelId !== null) {
      const channelId = guild.channels.cache.get(Data.channelId);
      if (!channelId) return;

      const Embed = new EmbedBuilder()
        .setTitle(`New Member Left`)
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription(
          `<@${user.id}> Left the server. We will miss you, we hope we see you again.`
        )
        .addFields(
          {
            name: "Account Created",
            value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
            inline: true,
          },
          {
            name: "Member Count",
            value: `${guild.memberCount} members`,
            inline: true,
          }
        )
        .setThumbnail(user.displayAvatarURL())
        .setFooter({ text: "Welcome-Leave System by FunGamers" })
        .setColor(client.color)

        .setTimestamp();
      channelId.send({ embeds: [Embed] });
    }
  },
};
