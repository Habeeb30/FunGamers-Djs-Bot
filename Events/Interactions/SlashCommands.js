const {
  Client,
  ChatInputCommandInteraction,
  InteractionType,
  EmbedBuilder,
} = require("discord.js");
const { ApplicationCommand } = InteractionType;
const Reply = require("../../Functions/Reply");
const BlacklistG = require("../../Schemas/BlacklistG");
const BlacklistU = require("../../Schemas/BlacklistU");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { user, guild, commandName, member, type } = interaction;

    if (!guild || user.bot) return;
    if (type !== ApplicationCommand) return;
    if (!interaction.isChatInputCommand()) return;

    const BlacklistGData = await BlacklistG.findOne({ Guild: guild.id }).catch(
      (err) => {}
    );
    const BlacklistUData = await BlacklistU.findOne({ User: user.id }).catch(
      (err) => {}
    );

    const Embed = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(guild.iconURL())
      .setTimestamp()
      .setFooter({ text: "Blacklist By FunGamers " });

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return Reply(interaction, "❎", "This command is outdated.", true);

    if (BlacklistGData)
      return interaction.reply({
        embeds: [
          Embed.setTitle("Server Blacklisted").setDescription(
            `Your server has been blacklisted from using this bot on <t:${parseInt(
              BlacklistGData.Time / 1000
            )}:R>, for the reason: **${BlacklistGData.Reason}**`
          ),
        ],
        ephemeral: true,
      });

    if (BlacklistUData)
      return interaction.reply({
        embeds: [
          Embed.setTitle("User Blacklisted").setDescription(
            `Your have been blacklisted from using this bot on <t:${parseInt(
              BlacklistUData.Time / 1000
            )}:R>, for the reason: **${BlacklistUData.Reason}**`
          ),
        ],
        ephemeral: true,
      });

    if (command.developer && interaction.user.id !== process.env.OwnerID)
      return Reply(
        interaction,
        "❎",
        "This command is only available to the developer.",
        true
      );
    if (command.UserPerms && command.UserPerms.length !== 0)
      if (!member.permissions.has(command.UserPerms))
        return Reply(
          interaction,
          "❎",
          `You need \`${command.UserPerms.join(
            ", "
          )}\` permission(s) to execute this command!`,
          true
        );
    if (command.BotPerms && command.BotPerms.length !== 0)
      if (!member.permissions.has(command.BotPerms))
        return Reply(
          interaction,
          "❎",
          `I need \`${command.BotPerms.join(
            ", "
          )}\` permission(s) to execute this command!`,
          true
        );

    command.execute(interaction, client);
  },
};
