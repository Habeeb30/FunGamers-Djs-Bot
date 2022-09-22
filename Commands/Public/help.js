const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SelectMenuBuilder,
  Client,
} = require("discord.js");

const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Sends the command list!"),

  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client, args) {
    const dirs = fs.readdirSync("./Commands");
    const slashCommands = await client.application.commands.fetch();
    const embedMsg = new EmbedBuilder()
      .setTitle("Help Command")
      .setDescription(
        "Select an option to get the command list of. Only one option can be selected."
      )
      .addFields(
        {
          name: "<:Folder:1018150584760672356> Total Command Categories",
          value: `<:reply:1018151357775089746> ${dirs.length - 1}`,
          inline: true,
        },
        {
          name: "<:slashcommand:1018147929938214984> Total Slash Commands",
          value: `<:reply:1018151357775089746> ${slashCommands.size}`,
          inline: true,
        }
      )
      .setColor("0x2F3136");

    let helpMenu = new ActionRowBuilder().addComponents(
      new SelectMenuBuilder()
        .setCustomId("helpMenu")
        .setMaxValues(1)
        .setMinValues(1)
        .setPlaceholder("Select a category")
    );

    fs.readdirSync("./Commands").forEach((command) => {
      helpMenu.components[0].addOptions({
        label: `${command}`,
        description: `Command list for ${command}`,
        value: `${command}`,
      });
    });

    // for (const folders of commandFolder) {
    //   helpMenu.components[0].addOptions({
    //     label: `${folders}`,
    //     description: `Command list for ${folders}`,
    //     value: `${folders}`,
    //   });
    // }

    interaction.reply({ embeds: [embedMsg], components: [helpMenu] });
  },
};
