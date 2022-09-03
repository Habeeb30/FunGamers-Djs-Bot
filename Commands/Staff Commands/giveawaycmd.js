const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Client,
  ChannelType,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Start a Giveaway")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((options) =>
      options
        .setName("start")
        .setDescription("Start a giveaway")
        .addStringOption((options) =>
          options
            .setName("duration")
            .setDescription("Pass a lenght (1m, 1h, 1d)")
            .setRequired(true)
        )
        .addIntegerOption((options) =>
          options
            .setName("winners")
            .setDescription("Set the winners of this Giveaway")
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName("prize")
            .setDescription("Set a prize to win")
            .setRequired(true)
        )
        .addChannelOption((options) =>
          options
            .setName("channel")
            .setDescription("Set the Channel where the giveaway is started.")
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((options) =>
      options
        .setName("actions")
        .setDescription("Options for giveaway")
        .addStringOption((options) =>
          options
            .setName("options")
            .setDescription("Select a Option")
            .addChoices(
              { name: "end", value: "end" },
              { name: "pause", value: "pause" },
              { name: "unpause", value: "unpause" },
              { name: "reroll", value: "reroll" },
              { name: "delete", value: "delete" }
            )
            .setRequired(true)
        )
        .addStringOption((options) =>
          options
            .setName("message_id")
            .setDescription("Set the MessageID of the Giveaway")
            .setRequired(true)
        )
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options } = interaction;
    const Sub = options.getSubcommand();

    const errorEmbed = new EmbedBuilder().setColor("Red");

    const successEmbed = new EmbedBuilder().setColor("#38ca08");

    switch (Sub) {
      case "start":
        {
          const gchannel = options.getChannel("channel") || interaction.channel;
          const duration = options.getString("duration");
          const winnerCount = options.getInteger("winners");
          const prize = options.getString("prize");

          gchannel
            .send(`@everyone`)
            .then((msg) => msg.delete({ timeout: 1000 }));
          client.giveawaysManager
            .start(gchannel, {
              duration: ms(duration),
              winnerCount,
              prize,
            })
            .then(async () => {
              successEmbed.setDescription(`Giveaway started in ${gchannel}`);
              return await interaction.reply({
                embeds: [successEmbed],
                ephemeral: true,
              });
            })
            .catch(async (err) => {
              errorEmbed.setDescription(`Error \n\`${err}\``);
              return await interaction.reply({
                embeds: [errorEmbed],
                ephemeral: true,
              });
            });
        }
        break;
      case "actions":
        {
          const choice = options.getString("options");
          const messageid = options.getString("message_id");
          const giveaway = client.giveawaysManager.giveaways.find(
            (g) =>
              g.guildId === interaction.guildId && g.messageId === messageid
          );

          if (!giveaway) {
            errorEmbed.setDescription(
              `The giveaway with the messageid ${messageid} could not be found.`
            );
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
          }
          switch (choice) {
            case "end":
              {
                client.giveawaysManager
                  .end(messageid)
                  .then(() => {
                    successEmbed.setDescription("Giveaway ended.");
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Error \n\`${err}\``);
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    });
                  });
              }
              break;
            case "pause":
              {
                client.giveawaysManager
                  .pause(messageid)
                  .then(() => {
                    successEmbed.setDescription("Giveaway paused");
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Error \n\`${err}\``);
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    });
                  });
              }
              break;
            case "unpause":
              {
                client.giveawaysManager
                  .unpause(messageid)
                  .then(() => {
                    successEmbed.setDescription("Giveaway unpaused");
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Error \n\`${err}\``);
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    });
                  });
              }
              break;
            case "reroll":
              {
                client.giveawaysManager
                  .reroll(messageid)
                  .then(() => {
                    successEmbed.setDescription("Giveaway rerolled");
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Error \n\`${err}\``);
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    });
                  });
              }
              break;
            case "delete":
              {
                client.giveawaysManager
                  .delete(messageid)
                  .then(() => {
                    successEmbed.setDescription("Giveaway deleted");
                    return interaction.reply({
                      embeds: [successEmbed],
                      ephemeral: true,
                    });
                  })
                  .catch((err) => {
                    errorEmbed.setDescription(`Error \n\`${err}\``);
                    return interaction.reply({
                      embeds: [errorEmbed],
                      ephemeral: true,
                    });
                  });
              }
              break;
          }
        }
        break;
      default: {
        console.log("Error in giveaway Command");
      }
    }
  },
};
