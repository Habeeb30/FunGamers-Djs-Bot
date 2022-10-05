const {
  Client,
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const Tickets = require("../../Schemas/Tickets");
const TicketSetup = require("../../Schemas/TicketSetup");
const TicketCount = require("../../Schemas/TicketCount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Configure the ticket system")
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
            .setName("transcript_channel")
            .setDescription("The channel to send the transcripts in.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText);
        })
        .addChannelOption((option) => {
          return option
            .setName("open_category")
            .setDescription("The category for open tickets.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory);
        })
        .addChannelOption((option) => {
          return option
            .setName("closed_category")
            .setDescription("The category for closed tickets.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory);
        })
        .addChannelOption((option) => {
          return option
            .setName("archive_category")
            .setDescription("The category for archived tickets.")
            .addChannelTypes(ChannelType.GuildCategory)
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
            .setName("title")
            .setDescription("The ticket system title")
            .setRequired(false);
        })
        .addStringOption((option) => {
          return option
            .setName("description")
            .setDescription("The ticket systems description")
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
        .setName("delete")
        .setDescription(`delete the ticket config`)
        .addStringOption((option) => {
          return option
            .setName(`options`)
            .setDescription(`Chose an option to delete that data`)
            .setRequired(true)
            .addChoices(
              { name: `ticket setup`, value: `setup` },
              { name: `tickets`, value: `tickets` },
              { name: `ticket count`, value: `count` }
            );
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove-user")
        .setDescription(`remove a user from the ticket`)
        .addUserOption((option) => {
          return option
            .setName(`user`)
            .setDescription(`Provide a user to manage`)
            .setRequired(true);
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add-user")
        .setDescription(`add a user for the ticket`)
        .addUserOption((option) => {
          return option
            .setName(`user`)
            .setDescription(`Provide a user to manage`)
            .setRequired(true);
        })
    ),
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, channel, options } = interaction;
    const i = interaction;

    const TicketsDB = await Tickets.findOne({ GuildID: guild.id });
    const TicketSetupDB = await TicketSetup.findOne({ GuildID: guild.id });
    const TicketCountDB = await TicketCount.findOne({ GuildID: guild.id });

    if (i.options.getSubcommand() === "setup") {
      if (TicketSetupDB)
        return i.reply({
          content: `> **Alert:** There is already a ticket system on this guild.`,
          ephemeral: true,
        });

      const Channel = options.getChannel("channel");
      const TranscriptChannel = options.getChannel("transcript_channel");
      const OpenCategory = options.getChannel("open_category");
      const ClosedCategory = options.getChannel("closed_category");
      const ArchiveCategory = options.getChannel("archive_category");
      const SupportRole = options.getRole("support_role");
      const description =
        interaction.options.getString("description") ||
        "Press 📩 to Create a Ticket";
      const title =
        interaction.options.getString("title") || "Create a ticket!";
      const button = interaction.options.getString("button") || "";

      await TicketSetup.findOneAndUpdate(
        { GuildID: guild.id },
        {
          ChannelID: Channel.id,
          TranscriptID: TranscriptChannel.id,
          OpenCategoryID: OpenCategory.id,
          ClosedCategoryID: ClosedCategory.id,
          ArchiveCategoryID: ArchiveCategory.id,
          SupportRoleID: SupportRole.id,
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
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId(`createTicket`)
              .setEmoji("📩")
              .setLabel(button)
              .setStyle(ButtonStyle.Secondary)
          ),
        ],
      });

      i.reply({
        content: `> **Alert:** Ticket created!`,
        ephemeral: true,
      });
    } // End of setup

    if (options.getSubcommand() === "remove-user") {
      const user = options.getMember("user");
      const TicketDB = await Tickets.findOne({
        GuildID: guild.id,
        ChannelID: channel.id,
      });
      if (!TicketDB)
        return i.reply({
          content: `> **Alert:** This command can only be used in Tickets!`,
          ephemeral: true,
        });

      interaction.channel.permissionOverwrites.edit(user.id, {
        ViewChannel: false,
      });

      await Tickets.findOneAndUpdate(
        { GuildID: guild.id, ChannelID: channel.id },
        { $pull: { MembersID: user.id } }
      );

      i.reply({
        content: `> **Alert:** You removed ${user}'s access for this ticket`,
        ephemeral: true,
      });
    } // End of add

    if (options.getSubcommand() === "add-user") {
      const user = options.getMember("user");
      const TicketDB = await Tickets.findOne({
        GuildID: guild.id,
        ChannelID: channel.id,
      });
      if (!TicketDB)
        return i.reply({
          content: `> **Alert:** This command can only be used in Tickets!`,
          ephemeral: true,
        });

      interaction.channel.permissionOverwrites.edit(user.id, {
        ViewChannel: true,
      });

      await Tickets.findOneAndUpdate(
        { GuildID: guild.id, ChannelID: channel.id },
        { $push: { MembersID: user.id } }
      );

      i.reply({
        content: `> **Alert:** You added ${user}'s access for this ticket`,
        ephemeral: true,
      });
    } // End of add

    if (options.getSubcommand() === "delete") {
      const DelOptions = options.getString("options");

      switch (DelOptions) {
        case "setup": {
          if (!TicketSetupDB) {
            return i.reply({
              content: `> **Alert:** There is no data related to ticket setup.`,
              ephemeral: true,
            });
          } else {
            await TicketSetup.findOneAndDelete({
              GuildId: guild.id,
            });

            return i.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(`Ticket setup has been deleted`),
              ],
              ephemeral: true,
            });
          }
        } // End of setup

        case "tickets": {
          if (!TicketsDB) {
            return i.reply({
              content: `> **Alert:** No tickets found to delete!`,
              ephemeral: true,
            });
          } else {
            await Tickets.deleteMany({ GuildID: guild.id });

            return i.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(`Tickets has been deleted`),
              ],
              ephemeral: true,
            });
          }
        } // End of tickets

        case "count": {
          if (!TicketCountDB) {
            return i.reply({
              content: `> **Alert:** No ticket count found to delete!`,
              ephemeral: true,
            });
          } else {
            await TicketCount.deleteMany({ GuildID: guild.id });

            return i.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(`Ticket count has been deleted`),
              ],
              ephemeral: true,
            });
          }
        } // End of count
      }
    } // End of delete system
  },
};
