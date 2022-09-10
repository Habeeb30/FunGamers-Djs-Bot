const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const joinSchema = require("../../Schemas/joinSchema");

module.exports = {
  name: "guildMemberAdd",

  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { user, guild } = interaction;

    joinSchema.findOne({ guildId: guild.id }, async (err, data) => {
      if (!data) {
        return;
      } else {
        client.channels.cache
          .get(data.channelId)
          .send({
            content: `<@${user.id}>`,
            embeds: [
              new EmbedBuilder()
                .setTitle(`ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ **${interaction.guild.name}**!`)
                .setDescription(
                  `Welcome <@${user.id}> to ${interaction.guild.name}! We hope you enjoy your stay!\n
                **ʀᴇᴀᴅ ᴏᴜʀ ʀᴜʟᴇꜱ**\n
                **ᴋɪɴᴅʟy ʙᴇ ʀᴇꜱᴩᴇᴄᴛꜰᴜʟ ʜᴇʀᴇ**\n
                **ʜᴀᴠᴇ ꜰᴜɴ ᴡɪᴛʜ ꜱᴇʀᴠᴇʀᴍᴀᴛᴇꜱ**\n
                **ʜᴀᴠᴇ ᴀ ɢʀᴇᴀᴛ ᴛɪᴍᴇ ʜᴇʀᴇ**\n
                Your Position At Discord Server is **${interaction.guild.memberCount}**`
                )
                .addFields(
                  {
                    name: "Account Created",
                    value: `<t:${parseInt(user.createdTimestamp / 1000)}:R>`,
                    inline: true,
                  },
                  {
                    name: "Member Count",
                    value: `${interaction.guild.memberCount} members`,
                    inline: true,
                  }
                )
                .setColor("#00ff00")

                .setTimestamp(),
            ],
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  },
};
