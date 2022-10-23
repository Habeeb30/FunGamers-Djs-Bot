const {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
} = require("discord.js");

const axios = require("axios");

const data = {
  name: "ronswanson",
  description: "Random quotes from the legendary Ron Swanson.",
  options: [
    {
      name: "search",
      description: "Search for quotes including specific terms.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  category: "Public",
  toJSON: () => ({ ...data }),
};

module.exports = {
  data,
  ...data,
  category: "Public",
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const search = interaction.options.getString("search");
    const embed = new EmbedBuilder().setTitle(`👨🏽 Best of Ron Swanson`);
    const reactions = ["😂", "🤨"];

    try {
      const response = await axios.get(
        `https://ron-swanson-quotes.herokuapp.com/v2/quotes/${
          search ? `search/${encodeURIComponent(search)}` : ""
        }`
      );

      if (!response?.data?.length) {
        embed
          .setColor("Orange")
          .setDescription(
            `Unable to find any quotes${
              search ? ` containing the term(s): ***${search}***` : ""
            }.`
          );
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      embed
        .setColor("Random")
        .setThumbnail(
          "https://static.wikia.nocookie.net/parksandrecreation/images/e/e1/Ron-0.jpg/revision/latest"
        )
        .setDescription(`*${response.data.slice(0, 10).join("\n\n")}*`); // Limit to 10 to ensure we don't accidentally hit the embed character limit, i.e. if the search term is just "I".

      const reply = await interaction.reply({
        embeds: [embed],
        fetchReply: true,
      });
      reactions.forEach((reaction) => reply.react(reaction).catch(() => {}));
    } catch (error) {
      embed
        .setColor("Red")
        .setTitle("🔍 Unable to reach API")
        .setDescription(`A connection to the API could not be established.`);

      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
