import path from "path";
import { fileURLToPath } from "url";
import { Client, GatewayIntentBits } from "discord.js";
import { CommandKit } from "commandkit";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const kit = new CommandKit({
  client,
  eventsPath: `${__dirname}/events`,
  commandsPath: `${__dirname}/commands`,
  bulkRegister: true,
});

client.login(process.env.BOT_TOKEN);
