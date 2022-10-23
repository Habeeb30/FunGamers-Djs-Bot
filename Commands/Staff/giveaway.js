const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputStyle,
} = require("discord.js");
const DB = require("../../Schemas/GiveawayDB");
const { endGiveaway } = require("../../Utils/GiveawayFunctions");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Create or manage a giveaway")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand.setName("create").setDescription("Create a giveaway.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("manage")
        .setDescription("Manage a giveaway.")
        .addStringOption((options) =>
          options
            .setName("toggle")
            .setDescription("Provide an option to manage")
            .setRequired(true)
            .addChoices(
              { name: "End", value: "end" },
              { name: "Pause", value: "pause" },
              { name: "Unpause", value: "unpause" },
              { name: "Reroll", value: "reroll" },
              { name: "Delete", value: "delete" }
            )
        )
        .addStringOption((options) =>
          options
            .setName("message-id")
            .setDescription("Provide the message ID of the giveaway.")
            .setRequired(true)
        )
    ),
  category: "Staff",
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "create":
        {
          const prize = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-prize")
              .setLabel("Prize")
              .setStyle(TextInputStyle.Short)
              .setMaxLength(256)
              .setRequired(true)
          );

          const winners = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-winners")
              .setLabel("Winner Count")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          );

          const duration = new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("giveaway-duration")
              .setLabel("Duration")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Example: 1 day")
              .setRequired(true)
          );

          const modal = new ModalBuilder()
            .setCustomId("giveaway-options")
            .setTitle("Create a Giveaway")
            .setComponents(prize, winners, duration);

          await interaction.showModal(modal);
        }
        break;

      case "manage":
        {
          const embed = new EmbedBuilder();
          const messageId = interaction.options.getString("message-id");
          const toggle = interaction.options.getString("toggle");

          const data = await DB.findOne({
            GuildID: interaction.guild.id,
            MessageID: messageId,
          });
          if (!data) {
            embed
              .setColor(client.color)
              .setDescription(
                "Could not find any giveaway with that message ID"
              );
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          const message = await interaction.guild.channels.cache
            .get(data.ChannelID)
            .messages.fetch(messageId);
          if (!message) {
            embed
              .setColor(client.color)
              .setDescription("This giveaway doesn't exist");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          if (["end", "reroll"].includes(toggle)) {
            if (data.Ended === (toggle === "end" ? true : false)) {
              embed
                .setColor(client.color)
                .setDescription(
                  `This giveaway has ${
                    toggle === "end" ? "already ended" : "not ended"
                  }`
                );
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (toggle === "end" && data.Paused === true) {
              embed
                .setColor(client.color)
                .setDescription(
                  "This giveaway is paused. Unpause it before ending the giveaway"
                );
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            endGiveaway(message, toggle === "end" ? false : true);

            embed
              .setColor(client.color)
              .setDescription(
                `The giveaway has ${
                  toggle === "end" ? "ended" : "been rerolled"
                }`
              );
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }

          if (["pause", "unpause"].includes(toggle)) {
            if (data.Ended) {
              embed
                .setColor(client.color)
                .setDescription("This giveaway has already ended");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (data.Paused === (toggle === "pause" ? true : false)) {
              embed
                .setColor(client.color)
                .setDescription(
                  `This giveaway is already ${
                    toggle === "pause" ? "paused" : "unpaused"
                  }`
                );
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const button = ActionRowBuilder.from(
              message.components[0]
            ).setComponents(
              ButtonBuilder.from(
                message.components[0].components[0]
              ).setDisabled(toggle === "pause" ? true : false)
            );

            const giveawayEmbed = EmbedBuilder.from(message.embeds[0]).setColor(
              toggle === "pause" ? client.color : client.color
            );

            await DB.findOneAndUpdate(
              {
                GuildID: interaction.guild.id,
                MessageID: message.id,
              },
              { Paused: toggle === "pause" ? true : false }
            );

            await message.edit({
              content: `🎉 **Giveaway ${
                toggle === "pause" ? "Paused" : "Started"
              }** 🎉`,
              embeds: [giveawayEmbed],
              components: [button],
            });

            embed
              .setColor(client.color)
              .setDescription(
                `The giveaway has been ${
                  toggle === "pause" ? "paused" : "unpaused"
                }`
              );
            interaction.reply({ embeds: [embed], ephemeral: true });

            if (toggle === "unpause" && data.EndTime * 1000 < Date.now())
              endGiveaway(message);
          }

          if (toggle === "delete") {
            await DB.deleteOne({
              GuildID: interaction.guild.id,
              MessageID: message.id,
            });

            await message.delete();
            embed
              .setColor(client.color)
              .setDescription("The giveaway has been deleted");
            interaction.reply({ embeds: [embed], ephemeral: true });
          }
        }
        break;
    }
  },
};
