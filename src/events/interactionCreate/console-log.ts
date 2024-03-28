import type { Interaction, TextChannel } from "discord.js";
import logger from "@/utils/logger";

export default function (interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  const username = interaction.user.username;
  const discriminator = interaction.user.discriminator;

  const guildName = interaction.guild?.name ?? "Direct Message";
  const channelName = (interaction.channel as TextChannel | null)?.name;
  const commandName = interaction.commandName;

  const discriminatorFmt = discriminator === "0" ? "" : `#${discriminator}`;
  const usernameFmt = `@${username}${discriminatorFmt}`;
  const channelNameFmt = channelName ? ` #${channelName}` : "";

  logger.info(
    `User ${usernameFmt} running command /${commandName} in [${
      guildName + channelNameFmt
    }]`
  );
}
