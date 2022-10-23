const { Client } = require("discord.js");
const Schema = require("../../Schemas/AIChat");
const axios = require("axios");
module.exports = {
  name: "messageCreate",
  /**
   *
   * @param {Client} client
   */
  async execute(message, client) {
    const data = Schema.findOne(
      { Guild: message.guild.id },
      async (err, data) => {
        if (!data) return message.author.send("Enable AIChat System");
        if (message.channel.id !== data.Channel) return;
        let channel = data.Channel;

        const chatbot = message.guild.channels.cache.get(data.Channel);
        if (!chatbot) {
          return;
        } else {
        }
        try {
          if (!message.guild) return;
          if (message.author.id === client.user.id) return;
          const res = await axios.get(
            `http://api.brainshop.ai/get?bid=170016&key=OvzlBQ1WZHJpSUup&uid=1&msg=${encodeURIComponent(
              message.content
            )}`
          );
          await chatbot.send({
            content: `<@${message.author.id}> ${res.data.cnt}`,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );
  },
};
