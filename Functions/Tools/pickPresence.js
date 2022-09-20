const { ActivityType } = require("discord.js");

module.exports = (client) => {
  client.pickPresence = async () => {
    const { ws } = client;
    const ping = ws.ping;
    const options = [
      {
        type: ActivityType.Watching,
        text: "FunGamers Videos",
        status: "dnd",
      },
      {
        type: ActivityType.Listening,
        text: "/help",
        status: "idle",
      },
      {
        type: ActivityType.Playing,
        text: "with Discord.js",
        status: "online",
      },
      {
        type: ActivityType.Streaming,
        text: `Ping: ${ping}ms`,
        status: "idle",
      },
    ];

    const option = Math.floor(Math.random() * options.length);

    client.user.setPresence({
      activities: [
        {
          name: options[option].text,
          type: options[option].type,
        },
      ],
      status: options[option].status,
    });
  };
};
