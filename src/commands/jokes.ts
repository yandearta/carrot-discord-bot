import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import logger from "@/utils/logger";

export const data = new SlashCommandBuilder()
  .setName("jokes")
  .setDescription("Carrot juga bisa ngejokes!");

export async function run({ interaction }: SlashCommandProps) {
  const message = await interaction.deferReply({ fetchReply: true });

  try {
    const res = await fetch("https://candaan-api.vercel.app/api/text/random");
    if (!res.ok) throw new Error(res.statusText);
    const data = (await res.json()) as { data: string };

    const embed = new EmbedBuilder()
      .setTitle("Carrot Jokes!")
      .setDescription(data.data)
      .setColor("#eade58");

    await interaction.editReply({ embeds: [embed] });
    message.react("😂");
  } catch (error) {
    await interaction.editReply({
      embeds: [
        errorEmbed(
          "Maaf, ada kesalahan. Tampaknya Carrot sedang lelah, coba lagi nanti ya."
        ),
      ],
    });
    logger.error(error);
  }
}
