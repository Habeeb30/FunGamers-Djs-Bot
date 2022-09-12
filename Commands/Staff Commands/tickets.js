const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const DB = require("../../Schemas/ticketData");
const countDB = require("../../Schemas/ticketCount");
const userDB = require("../../Schemas/guildTickets");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Configue the ticket system")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup the ticket system")
        .addChannelOption((option) => {
          return option
            .setName("channel")
            .setDescription("The channel to send the ticket panel in.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText);
        })
        .addChannelOption((option) => {
          return option
            .setName("category")
            .setDescription("The category to create the ticket in.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory);
        })
        .addChannelOption((option) => {
          return option
            .setName("transcript")
            .setDescription("Logs a ticket after its been closed")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText);
        })
        .addChannelOption((option) => {
          return option
            .setName("error_log")
            .setDescription("The ticket systems error channel")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true);
        })
        .addRoleOption((option) => {
          return option
            .setName("support_role")
            .setDescription("The role to assign to support tickets.")
            .setRequired(true);
        })
        .addStringOption((option) => {
          return option
            .setName("description")
            .setDescription("The ticket systems description")
            .setRequired(false);
        })
        .addStringOption((option) => {
          return option
            .setName("title")
            .setDescription("The ticket system title")
            .setRequired(false);
        })
        .addStringOption((option) => {
          return option
            .setName("button")
            .setDescription("The ticket system button name")
            .setRequired(false);
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup-delete")
        .setDescription("Deletes config for the tickets.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("count-delete")
        .setDescription("Deletes counting for the tickets.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription(`add a user to a specific ticket`)
        .addUserOption((option) => {
          return option
            .setName("user")
            .setDescription("Provide a user to add")
            .setRequired(true);
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription(`remove a user from a specific ticket`)
        .addUserOption((option) => {
          return option
            .setName("user")
            .setDescription("Provide a user to remove")
            .setRequired(true);
        })
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, channel, options } = interaction;

    if (interaction.options.getSubcommand() === "setup") {
      const channel = interaction.options.getChannel("channel");
      const category = interaction.options.getChannel("category");
      const transcript = interaction.options.getChannel("transcript");
      const erorrlog = interaction.options.getChannel("error_log");
      const supportRole = interaction.options.getRole("support_role");
      const description =
        interaction.options.getString("description") ||
        "Press 📩 to Create a Ticket";
      const title =
        interaction.options.getString("title") || "Create a ticket!";
      const button = interaction.options.getString("button") || " ";

      await DB.findOneAndUpdate(
        { GuildId: guild.id },
        {
          Channel: channel.id,
          Category: category.id,
          Transcript: transcript.id,
          ErrorLog: erorrlog.id,
          SupportRole: supportRole.id,
        },
        {
          new: true,
          upsert: true,
        }
      );

      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor("#303135")
            .setFooter({
              text: "The System by FunGamers",
              iconURL:
                "https://images-ext-1.discordapp.net/external/7zIa8B9n45knyj9tq5LWfjMSr2qjJFLezMseGZu5tos/https/emoji.discord.st/emojis/96586e0c-0d0c-4915-bab4-c5e9cd3fdec3.gif",
            }),
        ],
        components: [
          new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("createTicket")
              .setStyle(ButtonStyle.Primary)
              .setLabel(button)
              .setEmoji("📩")
          ),
        ],
      });

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription("Ticket setup complete!")
            .setColor("Green"),
        ],
        ephemeral: true,
      });
    }
    if (interaction.options.getSubcommand() === "setup-delete") {
      const ticketConfig = await DB.findOne({
        GuildId: interaction.guild.id,
      });
      if (!ticketConfig) {
        const NotCreatedSystem = new EmbedBuilder()
          .setDescription("An error occured:(")
          .setColor("Red");
        interaction.reply({ embeds: [NotCreatedSystem], ephemeral: true });
      } else {
        await DB.findOneAndDelete({ GuildId: interaction.guild.id });

        const CreatedSystem = new EmbedBuilder()
          .setDescription("Ticket system successfully deleted!")
          .setColor("Green");
        interaction.reply({ embeds: [CreatedSystem], ephemeral: true });
      }
    }

    if (interaction.options.getSubcommand() === "count-delete") {
      const ticketConfig = await countDB.findOne({
        GuildID: interaction.guild.id,
      });
      if (!ticketConfig) {
        const NotCreatedSystem = new EmbedBuilder()
          .setDescription("An error occured:(")
          .setColor("Red");
        interaction.reply({ embeds: [NotCreatedSystem], ephemeral: true });
      } else {
        await countDB.deleteMany({ GuildID: interaction.guild.id });

        const CreatedSystem = new EmbedBuilder()
          .setDescription("Ticket system successfully deleted!")
          .setColor("Green");
        interaction.reply({ embeds: [CreatedSystem], ephemeral: true });
      }
    }

    if (interaction.options.getSubcommand() === "add") {
      const ticketConfig = await userDB.findOne({
        GuildID: interaction.guild.id,
      });
      const user = interaction.options.getUser("user");

      const embed = new EmbedBuilder()
        .setDescription(`${user} has been added to the ticket!`)
        .setColor("#303135")
        .setFooter({
          text: `Action By ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });

      if (!ticketConfig) {
        const NotCreatedSystem = new EmbedBuilder()
          .setDescription("An error occured:(")
          .setColor("Red");
        interaction.reply({ embeds: [NotCreatedSystem], ephemeral: true });
      } else {
        if (interaction.channel.name.includes("ticket-")) {
          interaction.channel.permissionOverwrites.edit(user.id, {
            ViewChannel: true,
          });

          if (ticketConfig.Locked == true)
            return interaction.channel.permissionOverwrites.edit(user.id, {
              ViewChannel: true,
              SendMessages: false,
            });

          await userDB.findOneAndUpdate(
            { GuildID: guild.id, ChannelID: channel.id },
            { $push: { MembersID: user.id } }
          );
          interaction.reply({ embeds: [embed] });
        }
      }
    }

    if (interaction.options.getSubcommand() === "remove") {
      const ticketConfig = await userDB.findOne({
        GuildID: interaction.guild.id,
      });
      const user = interaction.options.getUser("user");

      const embed = new EmbedBuilder()
        .setDescription(`${user} has been removed from the ticket!`)
        .setColor("#303135")
        .setFooter({
          text: `Action By ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });

      if (!ticketConfig) {
        const NotCreatedSystem = new EmbedBuilder()
          .setDescription("An error occured:(")
          .setColor("Red");
        interaction.reply({ embeds: [NotCreatedSystem], ephemeral: true });
      } else {
        if (interaction.channel.name.includes("ticket-")) {
          interaction.channel.permissionOverwrites.edit(user.id, {
            ViewChannel: false,
          });

          await userDB.findOneAndUpdate(
            { GuildID: guild.id, ChannelID: channel.id },
            { $pull: { MembersID: user.id } }
          );
          interaction.reply({ embeds: [embed] });
        }
      }
    }
  },
};
