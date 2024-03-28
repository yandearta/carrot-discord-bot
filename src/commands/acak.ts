import { SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import formatNumber from "@/utils/formatNumber";

export const data = new SlashCommandBuilder()
  .setName("acak")
  .setDescription("Aku akan memilih angka acak di antara 2 input kamu!")
  .addNumberOption((option) =>
    option.setName("minimal").setDescription("Angka Minimal").setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("maksimal")
      .setDescription("Angka Maksimal")
      .setRequired(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const min = interaction.options.getNumber("minimal");
  const max = interaction.options.getNumber("maksimal");

  if (!min || !max) {
    return interaction.editReply({
      embeds: [errorEmbed("Minimal dan Maksimal harus diisi!")],
    });
  }

  const pickedNumber = Math.floor(Math.random() * (max - min + 1) + min);

  await interaction.reply(`Aku memilih \`${formatNumber(pickedNumber)}\`!`);
}
