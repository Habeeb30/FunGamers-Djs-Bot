const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const joinSchema = require("../../Schemas/joinSchema");

module.exports = {
  name: "guildMemberAdd",

  /**
   * @param {GuildMember} member
   * @param {Client} client
   */
  async execute(member, client) {
    const { user, guild } = member;

    const Data = await joinSchema
      .findOne({ guildId: guild.id })
      .catch((err) => {});
    if (!Data) return;

    const Message = `Hey ${user}, Welcome to **${guild.name}**`;

    let dmMsg;

    if (Data.DMMessage !== null) {
      var dmMessage = Data.DMMessage.content;

      if (dmMessage.length !== 0) dmMsg = dmMessage;
      else dmMsg = Message;
    } else dmMsg = Message;

    if (Data.channelId !== null) {
      const channelId = guild.channels.cache.get(Data.channelId);
      if (!channelId) return;

      const Embed = new EmbedBuilder()
        .setTitle(`ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ **${guild.name}**!`)
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription(
          `Welcome <@${user.id}> to ${guild.name}! We hope you enjoy your stay!\n
      **ʀᴇᴀᴅ ᴏᴜʀ ʀᴜʟᴇꜱ**\n
      **ᴋɪɴᴅʟy ʙᴇ ʀᴇꜱᴩᴇᴄᴛꜰᴜʟ ʜᴇʀᴇ**\n
      **ʜᴀᴠᴇ ꜰᴜɴ ᴡɪᴛʜ ꜱᴇʀᴠᴇʀᴍᴀᴛᴇꜱ**\n
      **ʜᴀᴠᴇ ᴀ ɢʀᴇᴀᴛ ᴛɪᴍᴇ ʜᴇʀᴇ**\n
      Your Position At Discord Server is **${guild.memberCount}**`
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
      channelId.send({ content: `${Message}`, embeds: [Embed] });
    }

    if (Data.DM === true) {
      const Embed = Data.DMMessage.embed;

      if (Data.Content === true && Data.Embed === true) {
        const Sent = await member.send({ content: `${dmMsg}` }).catch((err) => {
          if (err.code !== 50007) return console.log(err);
        });

        if (!Sent) return;
        if (Embed) Sent.edit({ embeds: [Embed] });
      } else if (Data.Content === true && Data.Embed !== true) {
        const Sent = await member.send({ content: `${dmMsg}` }).catch((err) => {
          if (err.code !== 50007) return console.log(err);
        });
      } else if (Data.Content !== true && Data.Embed === true) {
        if (Embed)
          member.send({ embeds: [Embed] }).catch((err) => {
            if (err.code !== 50007) return console.log(err);
          });
      } else return;
    }
  },
};
