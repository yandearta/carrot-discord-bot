import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

import {
  ApplicationCommandOptionData,
  Collection,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import type { SlashCommandProps } from "commandkit";

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Carrot bisa ngapain aja, sih?");

export async function run({ interaction }: SlashCommandProps) {
  const commands = await readCommands();

  const commandsFields = commands.map((command) => {
    const commandOptions = (
      command.options as unknown as ApplicationCommandOptionData[]
    )
      .map((option) =>
        option.name ? `\`<${option.name.replaceAll("-", " ")}>\`` : null
      )
      .join(" ");

    return {
      name: `/${command.name} ${commandOptions}`,
      value: command.description,
    };
  });

  const embed = new EmbedBuilder()
    .setTitle("Ini daftar semua kemampuanku!")
    .setColor("#eade58")
    .setThumbnail(
      "https://i.pinimg.com/originals/d0/fe/db/d0fedb56c084ae7cf5eda2c52a29527e.jpg"
    )
    .addFields(...commandsFields)
    .setFooter({
      text: "© Carrot " + new Date().getFullYear(),
      iconURL:
        "https://cdn.discordapp.com/app-icons/1066031310583382118/6a4a2ee2a10d9632022d18cd6868328c.png?size=256",
    })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

async function readCommands() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const commandFiles = fs
    .readdirSync(path.resolve(__dirname))
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
    .filter((file) => file !== "help.js" && file !== "help.ts");

  const commands = new Collection<string, SlashCommandBuilder>();

  for (const file of commandFiles) {
    const fileUrl = pathToFileURL(path.resolve(__dirname, file)).href;
    const { data } = await import(fileUrl);

    if (data instanceof SlashCommandBuilder) {
      commands.set(data.name, data);
    }
  }

  return commands;
}
