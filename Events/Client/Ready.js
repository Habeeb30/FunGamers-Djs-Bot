const chalk = require("chalk");
const { loadCommands } = require("../../Handlers/commandHandler");
const { Client, ActivityType } = require("discord.js");
const mongoose = require("mongoose");
const { Database_URI } = process.env;
require("dotenv").config();

module.exports = {
  name: "ready",
  once: true,
  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    console.log(chalk.yellow(`✅ >>> Ready! Logged in as ${client.user.tag}`));
    setTimeout(() => {
      setTimeout(client.checkVideo, 5 * 1000);
    }, timeout);

    loadCommands(client);

    client.user.setPresence({
      activities: [{ name: "/help", type: ActivityType.Listening }],
      status: "dnd",
    });

    if (!Database_URI) return;
    mongoose
      .connect(Database_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log(chalk.yellow(`✅ >>> Successfully connected to MongoDB!`));
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
