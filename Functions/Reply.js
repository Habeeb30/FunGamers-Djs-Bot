const { EmbedBuilder } = require("discord.js");

function Reply(interaction, emoji, description, type) {
  interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#303135")
        .setDescription(`${emoji} | ${description}`),
    ],
  });
}

module.exports = Reply;
