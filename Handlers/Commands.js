const { Perms } = require("../Validations/Permissions");
const { Client } = require("discord.js");
const ms = require("ms");

/**
 * @param {Client} client
 */
module.exports = async (client, PG, Ascii) => {
  const Table = new Ascii("Commands Loaded");

  let CommandsArray1 = [];

  const CommandFiles = await PG(`${process.cwd()}/Command/*/*.js`);

  CommandFiles.map(async (file) => {
    const command = require(file);

    if (!command.name)
      return Table.addRow(file.split("/")[7], "Failed", "Missing a Name");
    if (!command.context && !command.description)
      return Table.addRow(command.name, "Failed", "Missing a Description");
    if (command.UserPerms)
      if (command.UserPerms.every((perms) => Perms.includes(perms)))
        command.default_member_permissions = false;
      else
        return Table.addRow(
          command.name,
          "Failed",
          "User Permissions is Invalid"
        );

    client.commands2.set(command.name, command);
    CommandsArray1.push(command);

    await Table.addRow(command.name, "SUCCESSFUL");
  });

  console.log(Table.toString());

  client.on("ready", () => {
    setInterval(() => {
      client.guilds.cache.forEach((guild) => {
        guild.commands.set(CommandsArray1);
      }, ms("24h"));
    });
  });
};
