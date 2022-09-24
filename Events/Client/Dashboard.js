const { Client, ChannelType, WelcomeChannel } = require("discord.js");
const DarkDashboard = require("dbd-dark-dashboard");
const DBD = require("discord-dashboard");
const leaveSchema = require("../../Schemas/leaveSchema");
const joinSchema = require("../../Schemas/joinSchema");

module.exports = {
  name: "ready",

  /**
   *
   * @param {Client} client
   */
  async execute(client) {
    const { user } = client;

    let Information = [];
    let Moderation = [];
    let Public = [];
    let Staff = [];

    const info = client.commands.filter((x) => x.category === "Information");
    const mod = client.commands.filter((x) => x.category === "Moderation");
    const public = client.commands.filter((x) => x.category === "Public");
    const staff = client.commands.filter((x) => x.category === "Staff");

    CommandPush(info, Information);
    CommandPush(mod, Moderation);
    CommandPush(public, Public);
    CommandPush(staff, Staff);

    await DBD.useLicense(process.env.DBD);
    DBD.Dashboard = DBD.UpdatedClass();

    const Dashboard = new DBD.Dashboard({
      port: 5000,
      client: {
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
      },
      redirectUri: "http://lol.daki.cc:5000/discord/callback",
      domain: "http://lol.daki.cc",
      useThemeMaintenance: true,
      useTheme404: true,
      bot: client,
      supportServer: {
        slash: "/support",
        inviteUrl: "https://discord.gg/K3TGfHnvfP",
      },
      acceptPrivacyPolicy: true,
      minimizedConsoleLogs: true,
      guildAfterAuthorization: {
        use: true,
        guildId: "924203667802980362",
      },
      invite: {
        clientId: client.user.id,
        scopes: ["bot", "applications.commands", "guilds", "identify"],
        permissions: "66321471",
        redirectUrl: "https://discord.gg/K3TGfHnvfP",
      },
      theme: DarkDashboard({
        information: {
          createdBy: "Habeeb M",
          websiteTitle: "FunGamers",
          websiteName: "FunGamers",
          websiteUrl: "http://lol.daki.cc:5000/",
          dashboardUrl: "http://lol.daki.cc:5000/",
          supporteMail: "support@",
          supportServer: "https://discord.gg/yYq4UgRRzz",
          imageFavicon: "https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg",
          iconURL: "https://i.ibb.co/r7ZDcNB/My-FG-Logo.jpg",
          loggedIn: "Successfully signed in.",
          mainColor: "#00ffb4",
          subColor: "#ebdbdb",
          preloader: "Loading...",
        },

        index: {
          card: {
            category: "FunGamers Panel - The center of everything",
            title: `Welcome to the FunGamers discord bot where you can control the core features to the bot.`,
            image: "https://i.imgur.com/axnP93g.png",
            footer: "The Bot by Habeeb M",
          },

          information: {
            category: "About",
            title: "About Bot",
            description: `This Bot And Dashboard Created by Habeeb M in 2021/12/25 officially launched in 2022/09/11 before launching period we done lot of Research And Development and now our bot is officially out`,
            footer: "Thank for using our bot",
          },

          feeds: {
            category: "Bot",
            title: "Information",
            description: `This is our a multi purpose discord bot to make your discord server next level
            Ticket System,
            Welcome System,
            Moderation System,
            Verification System,
            Giveaway System,
            Report User System and some fun commands.`,
            footer: "FunGamers",
          },
        },

        commands: [
          {
            category: "Information",
            subTitle: "Information Commands",
            aliasesDisabled: false,
            list: Information,
          },
          {
            category: "Moderation",
            subTitle: "Moderation Commands",
            aliasesDisabled: false,
            list: Moderation,
          },
          {
            category: "Public",
            subTitle: "Public",
            aliasesDisabled: false,
            list: Public,
          },
          {
            category: "Staff",
            subTitle: "Staff",
            aliasesDisabled: false,
            list: Staff,
          },
        ],
      }),
      settings: [
        // Welcome And Leave System

        {
          categoryId: "welcome-leave",
          categoryName: "Welcome-Leave System",
          categoryDescription: "Setup the welcome & leave channel",
          categoryOptionsList: [
            // Welcome Channel
            {
              optionId: "welch",
              optionName: "Welcome Channel",
              optionDescription: "Set or reset the server's welcome channel",
              optionType: DBD.formTypes.channelsSelect(
                false,
                (ChannelTypes = [ChannelType.GuildText])
              ),
              getActualSet: async ({ guild }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});
                if (data) return data.channelId;
                else return null;
              },
              setNew: async ({ guild, newData }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});

                if (!newData) newData = null;

                if (!data) {
                  data = new joinSchema({
                    guildId: guild.id,
                    channelId: newData,
                    DM: false,
                    DMMessage: null,
                    Content: false,
                    Embed: false,
                  });

                  await data.save();
                } else {
                  data.channelId = newData;
                  await data.save();
                }
                return;
              },
            },
            // Welcome DM
            {
              optionId: "weldm",
              optionName: "Welcome DM",
              optionDescription: "Enable or Disable Welcome Message (in DM)",
              optionType: DBD.formTypes.switch(false),
              getActualSet: async ({ guild }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});
                if (data) return data.DM;
                else return false;
              },
              setNew: async ({ guild, newData }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});

                if (!newData) newData = false;

                if (!data) {
                  data = new joinSchema({
                    guildId: guild.id,
                    channelId: null,
                    DM: newData,
                    DMMessage: null,
                    Content: false,
                    Embed: false,
                  });

                  await data.save();
                } else {
                  data.DM = newData;
                  await data.save();
                }
                return;
              },
            },
            // Welcome DM Options
            {
              optionId: "weldmopt",
              optionName: "Welcome DM Options",
              optionDescription: "Send Content",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  first: true,
                },
              },
              getActualSet: async ({ guild }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});
                if (data) return data.Content;
                else return false;
              },
              setNew: async ({ guild, newData }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});

                if (!newData) newData = false;

                if (!data) {
                  data = new joinSchema({
                    guildId: guild.id,
                    channelId: null,
                    DM: false,
                    DMMessage: null,
                    Content: newData,
                    Embed: false,
                  });

                  await data.save();
                } else {
                  data.Content = newData;
                  await data.save();
                }
                return;
              },
            },
            // Welcome Embed
            {
              optionId: "welcembed",
              optionName: "",
              optionDescription: "Send Embed",
              optionType: DBD.formTypes.switch(false),
              themeOptions: {
                minimalbutton: {
                  last: true,
                },
              },
              getActualSet: async ({ guild }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});
                if (data) return data.Embed;
                else return false;
              },
              setNew: async ({ guild, newData }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});

                if (!newData) newData = false;

                if (!data) {
                  data = new joinSchema({
                    guildId: guild.id,
                    channelId: null,
                    DM: false,
                    DMMessage: null,
                    Content: false,
                    Embed: newData,
                  });

                  await data.save();
                } else {
                  data.Embed = newData;
                  await data.save();
                }
                return;
              },
            },
            // Welcome DMMessage
            {
              optionId: "weldmmsg",
              optionName: "Welcome Message (In DM)",
              optionDescription: "Send a message to DM of newly joined member",
              optionType: DBD.formTypes.embedBuilder({
                username: user.username,
                avatarURL: user.avatarURL(),
                defaultJson: {
                  content: "Welcome",
                  embed: {
                    description: "Welcome",
                  },
                },
              }),
              getActualSet: async ({ guild }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});
                if (data) return data.DMMessage;
                else return null;
              },
              setNew: async ({ guild, newData }) => {
                let data = await joinSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});

                if (!newData) newData = false;

                if (!data) {
                  data = new joinSchema({
                    guildId: guild.id,
                    channelId: null,
                    DM: false,
                    DMMessage: newData,
                    Content: false,
                    Embed: false,
                  });

                  await data.save();
                } else {
                  data.DMMessage = newData;
                  await data.save();
                }
                return;
              },
            },
            // Leave Channel
            {
              optionId: "levch",
              optionName: "Leave Channel",
              optionDescription: "Set or reset the server's leave channel",
              optionType: DBD.formTypes.channelsSelect(
                false,
                (ChannelTypes = [ChannelType.GuildText])
              ),
              getActualSet: async ({ guild }) => {
                let data = await leaveSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});
                if (data) return data.channelId;
                else return null;
              },
              setNew: async ({ guild, newData }) => {
                let data = await leaveSchema
                  .findOne({ guildId: guild.id })
                  .catch((err) => {});

                if (!newData) newData = null;

                if (!data) {
                  data = new leaveSchema({
                    guildId: guild.id,
                    channelId: newData,
                  });

                  await data.save();
                } else {
                  data.channelId = newData;
                  await data.save();
                }
                return;
              },
            },
          ],
        },
      ],
    });
    Dashboard.init();
  },
};

function CommandPush(filteredArray, CategoryArray) {
  filteredArray.forEach((obj) => {
    let cmdObject = {
      commandName: obj.name,
      commandUsage: "/" + obj.name,
      commandDescription: obj.description,
      commandAlias: "None",
    };

    CategoryArray.push(cmdObject);
  });
}
