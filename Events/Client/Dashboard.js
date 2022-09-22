const { Client } = require("discord.js");
const DarkDashboard = require("dbd-dark-dashboard");
const DBD = require("discord-dashboard");

module.exports = {
  name: "ready",

  /**
   *
   * @param {Client} client
   */
  async execute(client) {
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
      bot: client,
      supportServer: {
        slash: "/support",
        inviteUri: "https://discord.gg/K3TGfHnvfP",
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
        redirectUri: "https://discord.gg/K3TGfHnvfP",
      },
      theme: DarkDashboard({
        information: {
          createdBy: "iMidnight",
          websiteTitle: "iMidnight",
          websiteName: "iMidnight",
          websiteUrl: "https:/www.imidnight.ml/",
          dashboardUrl: "http://lol.daki.cc:5000/",
          supporteMail: "support@imidnight.ml",
          supportServer: "https://discord.gg/yYq4UgRRzz",
          imageFavicon: "https://www.imidnight.ml/assets/img/logo-circular.png",
          iconURL: "https://www.imidnight.ml/assets/img/logo-circular.png",
          loggedIn: "Successfully signed in.",
          mainColor: "#2CA8FF",
          subColor: "#ebdbdb",
          preloader: "Loading...",
        },

        index: {
          card: {
            category: "iMidnight's Panel - The center of everything",
            title: `Welcome to the iMidnight discord where you can control the core features to the bot.`,
            image: "https://i.imgur.com/axnP93g.png",
            footer: "Footer",
          },

          information: {
            category: "Category",
            title: "Information",
            description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
            footer: "Footer",
          },

          feeds: {
            category: "Category",
            title: "Information",
            description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
            footer: "Footer",
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
            subTitle: "Public Commands",
            aliasesDisabled: false,
            list: Public,
          },
          {
            category: "Staff",
            subTitle: "Staff Commands",
            aliasesDisabled: false,
            list: Staff,
          },
        ],
      }),
      settings: [],
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
