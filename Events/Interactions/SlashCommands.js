const {
  Client,
  ChatInputCommandInteraction,
  InteractionType,
} = require("discord.js");
const { ApplicationCommand } = InteractionType;
const Reply = require("../../Functions/Reply");

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

    const command = client.commands.get(interaction.commandName);
    if (!command)
      return Reply(interaction, "❎", "This command is outdated.", true);

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
