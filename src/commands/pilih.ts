import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import formatNumber from "@/utils/formatNumber";

export const data = new SlashCommandBuilder()
  .setName("pilih")
  .setDescription("Aku akan memilih salah satu dari beberapa input kamu!")
  .addStringOption((option) =>
    option
      .setName("opsi")
      .setDescription("Daftar opsi, pisahkan dengan koma (opsi 1, opsi 2 dst.)")
      .setRequired(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const choices = interaction.options.getString("opsi");
  const choicesFmt = choices
    ?.split(",")
    .map((choice) => choice.trim())
    .filter((choice) => choice);

  const uniqueChoices = [...new Set(choicesFmt)];

  if (uniqueChoices.length < 2) {
    return await interaction.reply({
      embeds: [errorEmbed("Berikan setidaknya 2 opsi!")],
    });
  }

  const pickedChoiceIndex = Math.floor(Math.random() * uniqueChoices.length);
  const pickedChoice = uniqueChoices[pickedChoiceIndex];

  const choicesDisplay = uniqueChoices
    .map((choice, i) => `${formatNumber(i)}. ${choice}`)
    .join("\n");

  const pickedChoiceFmt =
    pickedChoice.startsWith("<@") && pickedChoice.endsWith(">")
      ? pickedChoice
      : `**${pickedChoice}**`;

  const descriptipn = `
      Dari ${uniqueChoices.length} opsi:\n
      ${choicesDisplay}\n
      Aku memilih no ${formatNumber(pickedChoiceIndex + 1)}: ${pickedChoiceFmt}!
`;

  const embed = new EmbedBuilder()
    .setTitle("Pemilih Acak!")
    .setThumbnail("https://carrot.afkteam.dev/dice.png")
    .setDescription(descriptipn);

  await interaction.reply({ embeds: [embed] });
}
