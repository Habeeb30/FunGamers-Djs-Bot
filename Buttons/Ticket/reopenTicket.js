const { EmbedBuilder, Client } = require("discord.js");
const Tickets = require("../../Schemas/Tickets");
const TicketSetup = require("../../Schemas/TicketSetup");

module.exports = {
  id: "open_ticket",
  /**
   * @param {Client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { guild, channel, member, message } = interaction;
    const i = interaction;

    const TicketSetupDB = await TicketSetup.findOne({
      GuildId: guild.id,
    });
    if (!TicketSetupDB)
      return i.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Can't find any data on the ticket system:/`),
        ],
        ephemeral: true,
      });

    const TicketsDB = await Tickets.findOne({
      GuildId: guild.id,
      ChannelID: channel.id,
    });
    if (!TicketsDB)
      return i.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Can't find any data on this ticket:/`),
        ],
        ephemeral: true,
      });

    if (!member.roles.cache.find((r) => r.id === TicketSetupDB.SupportRoleID))
      return i.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(`Your not allowed to use this action!`),
        ],
        ephemeral: true,
      });

    if (TicketsDB.Deleted == true)
      return i.reply({
        content: `> **Alert:** Ticket has deleted can't use any actions`,
        ephemeral: true,
      });

    if (TicketsDB.Closed == false)
      return i.reply({
        content: `> **Alert:** Ticket already open`,
        ephemeral: true,
      });

    await i.reply({
      content: `> **Alert:** You opened the ticket`,
      ephemeral: true,
    });

    channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(client.color)
          .setDescription(`Ticket re-opened by ${member}.`),
      ],
    });

    channel.edit({ parent: TicketSetupDB.OpenCategoryID });
    message.delete(TicketsDB.MessageID);
    TicketsDB.MembersID.forEach((m) => {
      channel.permissionOverwrites.edit(m, {
        ViewChannel: true,
        SendMessages: true,
        ReadMessageHistory: true,
      });
    });

    await Tickets.findOneAndUpdate(
      {
        ChannelID: channel.id,
      },
      { Closed: false, Archived: false }
    );
  },
};
