const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const BlacklistG = require("../../Schemas/BlacklistG");
const BlacklistU = require("../../Schemas/BlacklistU");
const EditReply = require("../../Functions/EditReply");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Blacklist a server or user from using the bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("options")
        .setDescription("Choose an option")
        .setRequired(true)
        .addChoices(
          { name: "Server", value: "server" },
          { name: "User", value: "member" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Provide the ID of the user or the server")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Provide a reason")
        .setRequired(false)
    ),

  category: "Developer",

  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    const { user, options } = interaction;

    if (user.id !== "680843929221988409" && "539102574708654100")
      return EditReply(interaction, "⛔", "This command is classified!");

    const Options = options.getString("options");
    const ID = options.getString("id");
    const Reason = options.getString("reason") || "No reason provided";

    if (isNaN(ID))
      return EditReply(interaction, "⛔", "The ID is supposed to be a number!");

    switch (Options) {
      case "server":
        {
          const Guild = client.guilds.cache.get(ID);

          let GName;
          let GID;

          if (Guild) {
            GName = Guild.name;
            GID = Guild.id;
          } else {
            GName = "Unknown";
            GID = ID;
          }

          let Data = await BlacklistG.findOne({ Guild: GID }).catch(
            (err) => {}
          );

          if (!Data) {
            Data = new BlacklistG({
              Guild: GID,
              Reason,
              Time: Date.now(),
            });

            await Data.save();

            EditReply(
              interaction,
              "✅",
              `Successfully added **${GName} (${GID})** in blacklisted servers, for the reason: **${Reason}**`
            );
          } else {
            await Data.delete();

            EditReply(
              interaction,
              "✅",
              `Successfully removed **${GName} (${GID})** from the blacklisted servers`
            );
          }
        }
        break;

      case "member":
        {
          let Member;
          let MName;
          let MID;

          const User = client.users.cache.get(ID);

          if (User) {
            Member = User;
            MName = User.tag;
            MID = User.id;
          } else {
            Member = "Unknown user #0000";
            MName = "Unknown user #0000";
            MID = ID;
          }

          let Data = await BlacklistU.findOne({ User: MID }).catch((err) =>
            console.log(err)
          );

          if (!Data) {
            Data = new BlacklistU({
              User: MID,
              Reason,
              Time: Date.now(),
            });

            await Data.save();

            EditReply(
              interaction,
              "✅",
              `Successfully added **${Member} (${MName} | ${MID})** in blacklisted members, for the reason: **${Reason}**`
            );
          } else {
            await Data.delete();

            EditReply(
              interaction,
              "✅",
              `Successfully removed **${Member} (${MName} | ${MID})** from the blacklisted members`
            );
          }
        }
        break;
    }
  },
};
