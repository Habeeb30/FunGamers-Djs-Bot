const fs = require("fs");
const chalk = require("chalk");
const { loadCommands } = require("../../Handlers/commandHandler");
// const Handlers = fs.readdirSync("./Handlers");
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
  execute(client) {
    console.log(chalk.yellow(`✅ >>> Ready! Logged in as ${client.user.tag}`));

    loadCommands(client);
    // for (const folder of Handlers) {
    //   const Handlers = fs
    //     .readdirSync(`../../Handlers/${folder}`)
    //     .filter((file) => file.endsWith(".js"));
    //   for (const file of Handlers) {
    //     require(`../../Handlers/${folder}/${file}`)(client);
    //   }
    // }

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
