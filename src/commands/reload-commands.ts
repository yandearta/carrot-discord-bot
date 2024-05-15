import { SlashCommandBuilder } from "discord.js";
import type { CommandOptions, SlashCommandProps } from "commandkit";

import { successEmbed, errorEmbed } from "@/utils/statusEmbed";
import logger from "@/utils/logger";

export const data = new SlashCommandBuilder()
  .setName("reload-commands")
  .setDescription("Reload semua command")
  .setDMPermission(false);

export async function run({ interaction, handler }: SlashCommandProps) {
  await interaction.deferReply({ ephemeral: !!interaction.guildId });

  try {
    await handler.reloadCommands();

    interaction.editReply({
      embeds: [successEmbed("Berhasil reload semua command.")],
    });
  } catch (error) {
    logger.error("Error in reload-commands command:", error);
    interaction.editReply({
      embeds: [
        errorEmbed(
          `Terjadi kesalahan saat reload semua command. Coba lagi nanti.`
        ),
      ],
    });
  }
}

export const options: CommandOptions = {
  userPermissions: ["Administrator"],
  botPermissions: ["Administrator"],
};
