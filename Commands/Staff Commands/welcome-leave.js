const {
  PermissionFlagsBits,
  SlashCommandBuilder,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");
const leaveSchema = require("../../Schemas/leaveSchema");
const joinSchema = require("../../Schemas/joinSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("event")
    .setDescription("Welcome/leave command setup")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("disable")
        .setDescription("disable and delete the data on this guild")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("leave")
        .setDescription("Set or replace the leave message channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to send the leave message to.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("welcome")
        .setDescription("Set or replace the welcome message channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Channel to send the message to.")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)
        )
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "leave":
        {
          if (interaction.options.getSubcommand() === "leave") {
            const channel = interaction.options.getChannel("channel");
            const leaveSys = await leaveSchema.findOne({
              guildId: interaction.guild.id,
            });

            if (!leaveSys) {
              leaveChannel = new leaveSchema({
                guildId: interaction.guild.id,
                channelId: channel.id,
              });

              await leaveChannel.save().catch((err) => console.log(err));
              const successEmbed = new EmbedBuilder()
                .setDescription(`Enabled leave message in **${channel.name}**!`)
                .setColor("Red");
              await interaction.reply({
                embeds: [successEmbed],
                ephemeral: true,
              });
            }
            if (leaveSys) {
              await leaveSchema.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { channelId: channel.id }
              );
              const successEmbed = new EmbedBuilder()
                .setDescription(
                  `Updated leave messages to **${channel.name}**!`
                )
                .setColor("Red");

              await interaction.reply({
                embeds: [successEmbed],
                ephemeral: true,
              });
            }
          }
        }
        break;
      case "welcome":
        {
          if (interaction.options.getSubcommand() === "welcome") {
            const channel = interaction.options.getChannel("channel");
            const joinSys = await joinSchema.findOne({
              guildId: interaction.guild.id,
            });

            if (!joinSys) {
              joinChannel = new joinSchema({
                guildId: interaction.guild.id,
                channelId: channel.id,
              });

              await joinChannel.save().catch((err) => console.log(err));
              const successEmbed = new EmbedBuilder()
                .setDescription(
                  `Enabled welcome message in **${channel.name}**!`
                )
                .setColor("Green");
              await interaction.reply({
                embeds: [successEmbed],
                ephemeral: true,
              });
            }
            if (joinSys) {
              await joinSchema.findOneAndUpdate(
                { guildId: interaction.guild.id },
                { channelId: channel.id }
              );
              const successEmbed = new EmbedBuilder()
                .setDescription(
                  `Updated welcome messages to **${channel.name}**!`
                )
                .setColor("Green");

              await interaction.reply({
                embeds: [successEmbed],
                ephemeral: true,
              });
            }
          }
        }
        break;
      case "disable":
        {
          if (interaction.options.getSubcommand() === "disable") {
            await joinSchema.findOneAndDelete({
              guildId: interaction.guild.id,
            });
            await leaveSchema.findOneAndDelete({
              guildId: interaction.guild.id,
            });

            const successEmbed = new EmbedBuilder()
              .setDescription(`Successfully deleted the data in this guild.`)
              .setColor("Blurple");
            await interaction.reply({
              embeds: [successEmbed],
              ephemeral: true,
            });
          }
        }
        break;
    }
  },
};
