const { EmbedBuilder } = require("discord.js");
const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");

module.exports = (client) => {
  client.checkVideo = async () => {
    const data = await parser
      .parseURL(
        "https://youtube.com/feeds/videos.xml?channel_id=UCwa0TWMedslprAE8yBnRnPQ"
      )
      .catch(console.error);

    const rawData = fs.readFileSync(`${__dirname}/../../../JSON/video.json`);
    const jsonData = JSON.parse(rawData);

    if (jsonData.id !== data.items[0].id) {
      // New video or video not sent
      fs.writeFileSync(
        `${__dirname}/../../../JSON/video.json`,
        JSON.stringify({ id: data.items[0].id })
      );

      const guild = await client.guilds
        .fetch("1027620951938043935")
        .catch(console.error);
      const channel = await guild.channels
        .fetch("1027620953489944577")
        .catch(console.error);

      const { title, link, id, author } = data.items[0];
      const embed = new EmbedBuilder({
        title: title,
        url: link,
        timestamp: Date.now(),
        image: {
          url: `https://img.youtube.com/vi/${id.slice(9)}/maxresdefault.jpg`,
        },
        author: {
          name: author,
          iconURL: "https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg",
          url: "https://youtube.com/FUNGAMERS-FG/?sub_confirmation=1",
        },
        footer: {
          text: client.user.tag,
          iconURL: client.user.displayAvatarURL(),
        },
      });

      await channel
        .send({
          embeds: [embed],
          content: `Hey @everyone check out the new video!`,
        })
        .catch(console.error);
    }
  };
};
