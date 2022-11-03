const clientId = "924200727646195732";
const DiscordRPC = require("discord-rpc");
const RPC = new DiscordRPC.Client({ transport: "ipc" });

DiscordRPC.register(clientId);

async function setActivity() {
  if (!RPC) return;
  RPC.setActivity({
    details: `I was playing in servers`,
    state: `To see my commands use /help`,
    startTimestamp: Date.now(),
    largeImageKey: `my-fg-logo`,
    largeImageText: `Logo`,
    smallImageKey: `my-fg-logo`,
    smallImageText: `Logo`,
    instance: false,
    buttons: [
      {
        label: `Dashboard`,
        url: `https://dash.fungamers.xyz`,
      },
      {
        label: `Support Discord`,
        url: `https://discord.gg/K3TGfHnvfP`,
      },
    ],
  });
}

RPC.on("ready", async () => {
  setActivity();

  setInterval(() => {
    setActivity();
  }, 15 * 1000);
});

RPC.login({ clientId }).catch((err) => console.error(err));
