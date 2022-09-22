const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

const data = {
  name: "role",
  description: "Give or remove role from a member or everyone",
  UserPerms: ["ManageRoles"],
  options: [
    {
      name: "options",
      description: "Select the option",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Give", value: "give" },
        { name: "Remove", value: "remove" },
        { name: "Give All", value: "give-all" },
        { name: "Remove All", value: "remove-all" },
      ],
    },
    {
      name: "role",
      description: "Select the role to be managed",
      required: true,
      type: ApplicationCommandOptionType.Role,
    },
    {
      name: "user",
      description: "Select the user to manage roles",
      required: false,
      type: ApplicationCommandOptionType.User,
    },
  ],
  toJSON: () => ({ ...data }),
};

const EditReply = require("../../Functions/EditReply");
const Reply = require("../../Functions/Reply")
module.exports = {
  data,
  ...data,
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const { options, guild, member } = interaction;

    const Options = options.getString("options");
    const Role = options.getRole("role");
    const Target = options.getMember("user") || member;

    if (guild.members.me.roles.highest.position <= Role.position)
      return EditReply(
        interaction,
        "❎",
        "The role you're trying to manage for a member is higher than me!"
      );

    switch (Options) {
      case "give":
        {
          if (
            guild.members.me.roles.highest.position <=
            Target.roles.highest.position
          )
            return EditReply(
              interaction,
              "❎",
              "The member you're trying to manage is higher than me in roles!"
            );

          if (Target.roles.cache.find(r => r.id === Role.id))
            return EditReply(
              interaction,
              "❎",
              `${Target} 
              already has the role, **${Role.name}**!`
            );

          await Target.roles.add(Role);

          EditReply(
            interaction,
            "✅",
            `${Target} now has the role, **${Role.name}**!`
          );
        }
        break;

      case "remove":
        {
          if (
            guild.members.me.roles.highest.position <=
            Target.roles.highest.position
          )
            return EditReply(
              interaction,
              "❎",
              "The member you're trying to manage is higher than me in roles!"
            );

          if (!Target.roles.cache.find(r => r.id === Role.id))
            return EditReply(
              interaction,
              "❎",
              `${Target} 
                  doesn't have the role, **${Role.name}**!`
            );

          await Target.roles.remove(Role);

          EditReply(
            interaction,
            "✅",
            `${Target} has lost the role, **${Role.name}**!`
          );
        }
        break;

      case "give-all":
        {
          const Members = guild.members.cache.filter(m => !m.user.bot);

          EditReply(
            interaction,
            "✅",
            `Everyone now has the role, **${Role.name}**!`
          );

          await Members.forEach(m => m.roles.add(Role));
        }
        break;

      case "remove-all":
        {
          const Members = guild.members.cache.filter(m => !m.user.bot);

          EditReply(
            interaction,
            "✅",
            `Everyone has lost the role, **${Role.name}**!`
          );

          await Members.forEach(m => m.roles.remove(Role));
        }
        break;
    }
  },
};
