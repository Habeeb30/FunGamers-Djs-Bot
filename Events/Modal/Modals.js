const {
  Client,
  ModalSubmitInteraction,
  InteractionType,
  EmbedBuilder,
} = require("discord.js");
const EditReply = require("../../Functions/EditReply");

module.exports = {
  name: "interactionCreate",

  /**
   * @param {ModalSubmitInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { type, customId, channel, guild, user, fields } = interaction;

    const errorsEmbed = new EmbedBuilder()
      .setAuthor({ name: "Could not send announcement due to" })
      .setColor(client.color);

    if (type !== InteractionType.ModalSubmit) return;
    if (!guild || user.bot) return;

    if (customId !== "announce-modal") return;

    await interaction.deferReply({ ephemeral: true });

    const setTitle = fields.getTextInputValue("setTitle") || "New Announcement";
    const messageInput = fields.getTextInputValue("message-input");
    const setImage =
      fields.getTextInputValue("setImage") ||
      "https://i.ibb.co/DCfF2VL/announcement-image.jpg";
    const setAuthor_n =
      fields.getTextInputValue("setAuthor_n") || `${user.username}`;
    const setAuthor_u =
      fields.getTextInputValue("setAuthor_u") || `${user.displayAvatarURL()}`;

    if (!isValidUrl(setImage))
      // If it is a valid Image it runs
      return interaction.editReply({
        embeds: [errorsEmbed.setDescription("IMAGE URL is not valid")],
        ephemeral: true,
      });

    if (!isValidUrl(setAuthor_u))
      // If it is a valid Image it runs
      return interaction.editReply({
        embeds: [errorsEmbed.setDescription("IMAGE URL is not valid")],
        ephemeral: true,
      });

    const Embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: setAuthor_n,
        iconURL: setAuthor_u,
      })
      .setTitle(setTitle)
      .setThumbnail(guild.iconURL())
      .setDescription(messageInput)
      .setImage(setImage)
      .setTimestamp()
      .setFooter({
        text: "Announcement System By FunGamers",
        iconURL: "https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg",
      });
    EditReply(interaction, "✅", `Announcement is now live in ${channel}`);

    channel
      .send({ embeds: [Embed], content: "@everyone" })
      .then(async (msg) => {
        await msg.react("⬆");
        await msg.react("⬇");
      });
  },
};
const isValidUrl = (urlString) => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};
