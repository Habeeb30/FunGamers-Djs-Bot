const { Client, EmbedBuilder } = require("discord.js");
const client = require("../index");
const invites = new Map();
const DB = require("../Schemas/LogsChannel");
const SwitchDB = require("../Schemas/GeneralLogs");
const wait = require("timers/promises").setTimeout;
const { Discord } = require("discord-id");
const djsClient = new Discord(process.env.Token);

client.on("ready", async () => {
  await wait(1000);

  client.guilds.cache.forEach(async (guild) => {
    const firstInvite = await guild.invites.fetch().catch((err) => {
      if (err.code !== 50013) return console.log(err);
    });

    try {
      invites.set(
        guild.id,
        new Map(firstInvite.map((invite) => [invite.code, invite.uses]))
      );
    } catch (error) {
      if (error) return;
    }
  });
});

client.on("inviteDelete", (invite) => {
  invite.get(invite.guild.id).delete(invite.code);
});

client.on("inviteCreate", (invite) => {
  invite.get(invite.guild.id).set(invite.code, invite.uses);
});

client.on("guildCreate", (guild) => {
  guild.invites
    .fetch()
    .then((guildInvites) => {
      invites.set(
        guild.id,
        new Map(guildInvites.map((invite) => [invite.code, invite.uses]))
      );
    })
    .catch((err) => {
      if (err.code !== 50013) return console.log(err);
    });
});

client.on("guildDelete", (guild) => {
  invites.delete(guild.id);
});

client.on("guildMemberAdd", async (member) => {
  const { guild, user } = member;

  guild.invites.fetch().then(async (newInvites) => {
    const oldInvites = invites.get(guild.id);
    const invite = newInvites.find((i) => i.uses > oldInvites.get(i.code));

    const data = await DB.findOne({ Guild: guild.id }).catch((err) => {});
    const Data = await SwitchDB.findOne({ Guild: guild.id }).catch((err) => {});

    if (!Data) return;
    if (Data.Invite === false) return;
    if (!data) return;
    const logsChannel = data.Channel;

    const Channel = await guild.channels.cache.get(logsChannel);
    if (!Channel) return;

    const Embed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle("Invite Logged")
      .setTimestamp();

    if (!invite)
      return Channel.send({
        embeds: [
          Embed.setDescription(
            `${user.tag} joined but, couldn't find through which invite`
          ),
        ],
      });

    djsClient
      .grabProfile(invite.inviter.id)
      .then(async (inviter) => {
        const Inviter = inviter.username + "#" + inviter.discriminator;

        return Channel.send({
          embeds: [
            Embed.setDescription(
              `${user.tag} has joined using invite code ${invite.code} from ${Inviter}. The code has been used a total of ${invite.uses} times`
            ),
          ],
        });
      })
      .cache((err) => {
        if (err.code !== 50013) return console.log(err);
      });
  });
});
