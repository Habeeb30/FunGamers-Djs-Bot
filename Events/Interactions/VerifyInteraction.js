const {
  Client,
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
} = require("discord.js");
const verifySchema = require("../../Schemas/verifySchema");
const randomString = require("randomized-string");

module.exports = {
  name: "interactionCreate",

  /**
   * @param { Client } client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const Data = await verifySchema
      .findOne({ guildId: guild.id })
      .catch((err) => {});
    if (!Data) return;

    if (Data.channelId !== null) {
      const channelId = guild.channels.cache.get(Data.channelId);
      if (!channelId) return;

      const embed = new EmbedBuilder()
        .setThumbnail(
          "https://emoji.discord.st/emojis/5045414d-7cd4-4024-ac6b-809e920fcf9d.gif"
        )
        .setDescription(
          "Welcome to the server! Please authorize yourself by clicking the button below! When you verify you will be granted the 'verified' role"
        )
        .setColor(client.color)
        .setImage(
          "https://verif-y.com/wp-content/uploads/2020/07/Verif-y-logo.png"
        )
        .setFooter({
          text: "The System by FunGamers",
          iconURL:
            "https://images-ext-1.discordapp.net/external/7zIa8B9n45knyj9tq5LWfjMSr2qjJFLezMseGZu5tos/https/emoji.discord.st/emojis/96586e0c-0d0c-4915-bab4-c5e9cd3fdec3.gif",
        })
        .setTitle(`Welcome to ${interaction.guild.name}!`);

      const button = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setCustomId("verifyMember")
          .setLabel("Verify")
          .setStyle(ButtonStyle.Success)
          .setEmoji("<:dev_yes:999673591341797416>")
      );
      channelId.send({ embeds: [embed], components: [button] });
    }
  },
};
