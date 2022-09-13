const { EmbedBuilder } = require("discord.js");

function EditReply(interaction, emoji, description) {
  interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor("#303135")
        .setDescription(`${emoji} | ${description}`),
    ],
  });
}
module.exports = EditReply;
