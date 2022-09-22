const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
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
      return interaction.followUp({
        embeds: [
          new EmbedBuilder()
            .setColor(client.color)
            .setDescription(
              `The role you're trying to manage for a member is higher than me!`
            ),
        ],
        ephemeral: true,
      });

    switch (Options) {
      case "give":
        {
          if (
            guild.members.me.roles.highest.position <=
            Target.roles.highest.position
          )
            return interaction.followUp({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(
                    `The role you're trying to manage is higher than me in roles!`
                  ),
              ],
              ephemeral: true,
            });

          if (Target.roles.cache.find(r => r.id === Role.id))
            return interaction.followUp({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(
                    `${Target} already has the role, **${Role.name}**!`
                  ),
              ],
              ephemeral: true,
            });

          await Target.roles.add(Role);

          interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${Target} now has the role, **${Role.name}**!`
                ),
            ],
            ephemeral: true,
          });
        }
        break;

      case "remove":
        {
          if (
            guild.members.me.roles.highest.position <=
            Target.roles.highest.position
          )
            return 
            interaction.followUp({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(
                    `The member you're trying to manage is higher than me in roles!`
                  ),
              ],
              ephemeral: true,
            });

          if (!Target.roles.cache.find(r => r.id === Role.id))
            return interaction.followUp({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(
                    `${Target} doesn't have the role, **${Role.name}**!`
                  ),
              ],
              ephemeral: true,
            }); 

          await Target.roles.remove(Role);

          interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `${Target} has lost the role, **${Role.name}**!`
                ),
            ],
            ephemeral: true,
          });
        }
        break;

      case "give-all":
        {
          const Members = guild.members.cache.filter(m => !m.user.bot);

          interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `Everyone now has the role, **${Role.name}**!`
                ),
            ],
            ephemeral: true,
          });

          await Members.forEach(m => m.roles.add(Role));
        }
        break;

      case "remove-all":
        {
          const Members = guild.members.cache.filter(m => !m.user.bot);

          interaction.followUp({
            embeds: [
              new EmbedBuilder()
                .setColor(client.color)
                .setDescription(
                  `Everyone has lost the role, **${Role.name}**!`
                ),
            ],
            ephemeral: true,
          });
          await Members.forEach(m => m.roles.remove(Role));
        }
        break;
    }
  },
};
