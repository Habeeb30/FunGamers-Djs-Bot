const { Client, GuildMember, EmbedBuilder } = require("discord.js");
const DB = require("../../Schemas/LogsChannel");
const SwitchDB = require("../../Schemas/GeneralLogs");

module.exports = {
  name: "guildMemberUpdate",

  /**
   * @param {GuildMember} oldMember
   * @param {GuildMember} newMember
   * @param {Client} client
   */
  async execute(oldMember, newMember, client) {
    const { guild, user } = newMember;

    const data = await DB.findOne({ Guild: guild.id }).catch((err) =>
      console.log(err)
    );
    const Data = await SwitchDB.findOne({ Guild: guild.id }).catch((err) =>
      console.log(err)
    );

    if (!Data) return;
    if (Data.MemberRole === false) return;
    if (!data) return;

    const logsChannel = data.Channel;

    const Channel = await guild.channels.cache.get(logsChannel);
    if (!Channel) return;

    const oldRoles = oldMember.roles.cache.map((r) => r.id);
    const newRoles = newMember.roles.cache.map((r) => r.id);

    const Embed = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(user.displayAvatarURL())
      .setFooter({ text: "Logged By FunGamers" })
      .setTimestamp();

    if (oldRoles.length > newRoles.length) {
      const RoleID = Unique(oldRoles, newRoles);
      const Role = guild.roles.cache.get(RoleID[0].toString());

      return Channel.send({
        embeds: [
          Embed.setTitle(`⚙ | Member Updated`).setDescription(
            `**${user.tag}** has lost the role \`${Role.name}\``
          ),
        ],
      });
    } else if (oldRoles.length < newRoles.length) {
      const RoleID = Unique(oldRoles, newRoles);
      const Role = guild.roles.cache.get(RoleID[0].toString());

      return Channel.send({
        embeds: [
          Embed.setTitle(`⚙ | Member Updated`).setDescription(
            `**${user.tag}** has got the role \`${Role.name}\``
          ),
        ],
      });
    } else if (newMember.nickname !== oldMember.nickname) {
      return Channel.send({
        embeds: [
          Embed.setTitle(`⚙ | Member Updated`).setDescription(
            `**${newMember.user.tag}** nickname has been changed from: \`${oldMember.nickname}\` to: \`${newMember.nickname}\``
          ),
        ],
      });
    } else if (!oldMember.premiumSince && newMember.premiumSince) {
      return Channel.send({
        embeds: [
          Embed.setTitle(`⚙ | Boots Detected`).setDescription(
            `**${newMember.user.tag}** has started boosting the server`
          ),
        ],
      });
    } else if (!newMember.premiumSince && oldMember.premiumSince) {
      return Channel.send({
        embeds: [
          Embed.setTitle(`⚙ | Unboots Detected`).setDescription(
            `**${newMember.user.tag}** has stopped boosting the server`
          ),
        ],
      });
    }
  },
};

/**
 * @param {Array} arr1 - First Array
 * @param {Array} arr2 - Second Array
 */
function Unique(arr1, arr2) {
  let unique1 = arr1.filter((o) => arr2.indexOf(o) === -1);
  let unique2 = arr2.filter((o) => arr1.indexOf(o) === -1);

  const unique = unique1.concat(unique2);

  return unique;
}
