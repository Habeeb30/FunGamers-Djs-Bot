const { Client, ChatInputCommandInteraction } = require("discord.js");
const Reply = require("../../Functions/Reply");
const EditReply = require("../../Functions/EditReply");

module.exports = {
  name: "activity",
  description: "Creates a Discord Together Activity",
  category: "Utility",
  options: [
    {
      name: "type",
      description: "Choose a Discord Activity",
      type: 3,
      required: true,
      choices: [
        {
          name: "YouTube",
          value: "1",
        },
        {
          name: "Chess",
          value: "2",
        },
        {
          name: "Betrayal",
          value: "3",
        },
        {
          name: "Poker",
          value: "4",
        },
        {
          name: "Fish",
          value: "5",
        },
        {
          name: "Letter Tile",
          value: "6",
        },
        {
          name: "Word Snack",
          value: "7",
        },
        {
          name: "Doodle Crew",
          value: "8",
        },
        {
          name: "Spell Cast",
          value: "9",
        },
        {
          name: "AwkWord",
          value: "10",
        },
        {
          name: "Putt Party",
          value: "11",
        },
      ],
    },
  ],

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    const { options, member } = interaction;
    const choices = options.getString("type");

    const App = client.discordTogether;

    const VC = member.voice.channel;
    if (!VC)
      return Reply(
        interaction,
        "⛔",
        "You've to be in a VC to this command",
        true
      );

    await interaction.deferReply();

    switch (choices) {
      case "1":
        {
          App.createTogetherCode(VC.id, "youtube").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[YouTube Together Activity](${invite.code})**`
            )
          );
        }
        break;
      case "2":
        {
          App.createTogetherCode(VC.id, "chess").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[Chess](${invite.code})**`
            )
          );
        }
        break;
      case "3":
        {
          App.createTogetherCode(VC.id, "betrayal").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[Betrayal](${invite.code})**`
            )
          );
        }
        break;
      case "4":
        {
          App.createTogetherCode(VC.id, "poker").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[Poker](${invite.code})**`
            )
          );
        }
        break;
      case "5":
        {
          App.createTogetherCode(VC.id, "fishing").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[Fish](${invite.code})**`
            )
          );
        }
        break;
      case "6":
        {
          App.createTogetherCode(VC.id, "lettertile").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[Letter Tile](${invite.code})**`
            )
          );
        }
        break;
      case "7":
        {
          App.createTogetherCode(VC.id, "wordsnack").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[WordSnack](${invite.code})**`
            )
          );
        }
        break;
      case "8":
        {
          App.createTogetherCode(VC.id, "doodlecrew").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[DoodleCrew](${invite.code})**`
            )
          );
        }
        break;
      case "9":
        {
          App.createTogetherCode(VC.id, "spellcast").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[SpellCast](${invite.code})**`
            )
          );
        }
        break;
      case "10":
        {
          App.createTogetherCode(VC.id, "awkword").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[AwkWord](${invite.code})**`
            )
          );
        }
        break;
      case "11":
        {
          App.createTogetherCode(VC.id, "puttparty").then((invite) =>
            EditReply(
              interaction,
              "🔶",
              `Click here to join the **[PuttParty](${invite.code})**`
            )
          );
        }
        break;
    }
  },
};
