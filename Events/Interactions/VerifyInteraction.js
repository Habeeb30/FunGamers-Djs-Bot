const {
  Client,
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
} = require("discord.js");
const roleSchema = require("../../Schemas/verifyRoleId");

const randomString = require("randomized-string");

module.exports = {
  name: "interactionCreate",

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      switch (interaction.commandName) {
        case "setup-verification":
          const channel = interaction.options.getChannel("channel");
          const description =
            interaction.options.getString("description") ||
            "Welcome to the server! Please authorize yourself by clicking the button below! When you verify you will be granted the 'verified' role";
          const title =
            interaction.options.getString("title") ||
            `Welcome to ${interaction.guild.name}!`;

          const embed = new EmbedBuilder()
            .setThumbnail(
              "https://emoji.discord.st/emojis/5045414d-7cd4-4024-ac6b-809e920fcf9d.gif"
            )
            .setDescription(description)
            .setColor("fcd303")
            .setImage(
              "https://verif-y.com/wp-content/uploads/2020/07/Verif-y-logo.png"
            )
            .setFooter({
              text: "The System by FunGamers",
              iconURL:
                "https://images-ext-1.discordapp.net/external/7zIa8B9n45knyj9tq5LWfjMSr2qjJFLezMseGZu5tos/https/emoji.discord.st/emojis/96586e0c-0d0c-4915-bab4-c5e9cd3fdec3.gif",
            })
            .setTitle(title);

          const button = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("verifyMember")
              .setLabel("Verify")
              .setStyle(ButtonStyle.Success)
              .setEmoji("<:dev_yes:999673591341797416>")
          );

          channel.send({
            embeds: [embed],
            components: [button],
          });

          break;
      }
    } else if (interaction.isButton()) {
      switch (interaction.customId) {
        case "verifyMember": {
          const verifyRoleId = await roleSchema.findOne({
            guildId: interaction.guild.id,
          });

          if (!verifyRoleId) {
            interaction.reply({
              content:
                "You have not set a verification role yet! Use `/setrole` to set one!",
              ephemeral: true,
            });
            return;
          }

          var randomToken = randomString
            .generate({ length: 5, charset: "hex" })
            .toUpperCase();

          if (
            interaction.member.roles.cache.some(
              (role) => role.id === verifyRoleId.roleId
            )
          ) {
            interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setDescription(
                    "You have already verified that you are a not robot!"
                  )
                  .setColor("Blue"),
              ],
              ephemeral: true,
            });
            return;
          }

          const modal = new ModalBuilder()
            .setCustomId("verifyUserModal")
            .setTitle(`Verification code: ${randomToken}`)
            .setComponents(
              new ActionRowBuilder().setComponents(
                new TextInputBuilder()
                  .setCustomId("veryUserInput")
                  .setLabel("Verification code in title:")
                  .setStyle(TextInputStyle.Short)
                  .setRequired(true)
                  .setMaxLength(5)
              )
            ); //

          await interaction.showModal(modal);
          const modalSubmitInt = await interaction
            .awaitModalSubmit({
              filter: (i) => {
                return true;
              },
              time: 600000,
            })
            .catch((e) => {
              console.log(e);
            });

          if (
            modalSubmitInt?.fields &&
            modalSubmitInt.fields
              .getTextInputValue("veryUserInput")
              .toUpperCase() === randomToken
          ) {
            const role = interaction.guild.roles.cache.get(verifyRoleId.roleId);

            if (!role)
              return interaction.reply({
                content: "Role not found!",
                ephemeral: true,
              });
            await interaction.member.roles.add(role).then((m) => {
              interaction
                .followUp({
                  embeds: [
                    new EmbedBuilder()
                      .setTitle("Verification Successful!")
                      .setDescription(
                        `You have been verified and have been given the ${role.name} role!`
                      )
                      .setColor("Green"),
                  ],
                  ephemeral: true,
                })
                .catch((err) => {
                  console.log(err);
                });
            });
          }

          if (
            modalSubmitInt?.fields &&
            modalSubmitInt.fields
              .getTextInputValue("veryUserInput")
              .toUpperCase() !== randomToken
          ) {
            interaction.followUp({
              content: "You have entered the wrong code!",
              ephemeral: true,
            });
          }
          break;
        }

        default:
          break;
      }
    }
  },
};
