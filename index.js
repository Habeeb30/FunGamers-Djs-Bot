const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
require("dotenv").config();
const { Token } = process.env;
const {
  Guilds,
  GuildMembers,
  GuildMessages,
  GuildMessageReactions,
  MessageContent,
} = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [
    Guilds,
    GuildMembers,
    GuildMessages,
    GuildMessageReactions,
    MessageContent,
  ],
  partials: [User, Message, GuildMember, ThreadMember],
});
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

const { loadEvents } = require("./Handlers/eventHandler");
const { loadButtons } = require("./Handlers/buttonHandler");
const { loadModals } = require("./Handlers/modalHandler");

client.events = new Collection();
// client.events2 = new Collection();
client.commands = new Collection();
// client.commands2 = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
// client.selectMenus = new Collection();

const { DiscordTogether } = require("discord-together");
client.discordTogether = new DiscordTogether(client);

loadEvents(client);
loadModals(client);
loadButtons(client);

require("./Handlers/antiCrash")(client);

const Handlers = ["EventStack"];

Handlers.forEach((handler) => {
  require(`./Handlers/${handler}`)(client, PG, Ascii);
});

client.color = "#303135";

module.exports = client;

client.login(Token);
