const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announce a Message")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
  category: "Utility",

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const modal = new ModalBuilder()
      .setCustomId("announce-modal")
      .setTitle("Announcement");

    const messageInput = new TextInputBuilder()
      .setCustomId("message-input")
      .setLabel("Message")
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder("Enter The Announcement message")
      .setRequired(true);

    const setTitle = new TextInputBuilder()
      .setCustomId("setTitle")
      .setLabel("Title")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Enter The Announcement title")
      .setRequired(true);

    const setImage = new TextInputBuilder()
      .setCustomId("setImage")
      .setLabel("Image")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Ex: https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg")
      .setRequired(true);
    const setAuthor_n = new TextInputBuilder()
      .setCustomId("setAuthor_n")
      .setLabel("Author Name")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Ex: Habeeb M")
      .setRequired(true);
    const setAuthor_u = new TextInputBuilder()
      .setCustomId("setAuthor_u")
      .setLabel("Author iconURL")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("Ex: https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg")
      .setRequired(true);
    const Row = new ActionRowBuilder().addComponents(messageInput);
    const Row2 = new ActionRowBuilder().addComponents(setTitle);
    const Row4 = new ActionRowBuilder().addComponents(setImage);
    const Row5 = new ActionRowBuilder().addComponents(setAuthor_n);
    const Row6 = new ActionRowBuilder().addComponents(setAuthor_u);

    modal.addComponents(Row, Row2, Row4, Row5, Row6);

    await interaction.showModal(modal);
  },
};
