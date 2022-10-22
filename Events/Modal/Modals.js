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

    if (type !== InteractionType.ModalSubmit) return;
    if (!guild || user.bot) return;

    if (customId !== "announce-modal") return;

    await interaction.deferReply({ ephemeral: true });

    const messageInput = fields.getTextInputValue("message-input");
    const setTitle = fields.getTextInputValue("setTitle");
    const setImage = fields.getTextInputValue("setImage");
    const setAuthor_n = fields.getTextInputValue("setAuthor_n");
    const setAuthor_u = fields.getTextInputValue("setAuthor_u");

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
