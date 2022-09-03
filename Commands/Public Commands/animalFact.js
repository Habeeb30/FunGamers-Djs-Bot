const {
  ChatInputCommandInteraction,
  Client,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const axios = require("axios").default;

const data = {
  name: "fact",
  description: "Get a random fact about an animal",
  options: [
    {
      name: "animal",
      description: "Select an animal to get a fact about",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "Dog", value: "dog" },
        { name: "Cat", value: "cat" },
        { name: "Panda", value: "panda" },
        { name: "Fox", value: "fox" },
        { name: "Bird", value: "bird" },
        { name: "Koala", value: "koala" },
      ],
    },
  ],
  toJSON: () => ({ ...data }),
};

module.exports = {
  data,
  ...data,
  /**
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    await interaction.deferReply();
    const option = interaction.options.getString("animal");
    const imageObject = await axios.get(
      `https://some-random-api.ml/img/${option.replace("birb", "bird")}`
    );
    const factObject = await axios.get(
      `https://some-random-api.ml/facts/${option}`
    );

    const attachment = new AttachmentBuilder(imageObject.data.link, {
      name: "image.png",
    });
    interaction.editReply({
      content: factObject.data.fact,
      files: [attachment],
    });
  },
};
