const {
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const leaveSchema = require("../../Schemas/leaveSchema");

module.exports = {
  name: "guildMemberRemove",

  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { user, guild } = interaction;

    leaveSchema.findOne({ guildId: guild.id }, async (err, data) => {
      if (!data) {
        return;
      } else {
        client.channels.cache
          .get(data.channelId)
          .send({
            embeds: [
              new EmbedBuilder()
                .setTitle(`New Member Left`)
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
                    value: `${interaction.guild.memberCount} members`,
                    inline: true,
                  }
                )
                .setColor("Red")

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
