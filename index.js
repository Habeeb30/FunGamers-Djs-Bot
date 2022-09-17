const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");
require("dotenv").config();
const { Token } = process.env;
const { Guilds, GuildMembers, GuildMessages, GuildMessageReactions } =
  GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildMessageReactions],
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");
const { loadButtons } = require("./Handlers/buttonHandler");
const { loadModals } = require("./Handlers/modalHandler");

client.events = new Collection();
client.commands = new Collection();
client.subCommands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
// client.selectMenus = new Collection();

loadEvents(client);
loadModals(client);
loadButtons(client);

require("./Handlers/antiCrash")(client);

["Giveawaysys"].forEach((system) => {
  require(`./Systems/${system}`)(client);
});

client.login(Token);
