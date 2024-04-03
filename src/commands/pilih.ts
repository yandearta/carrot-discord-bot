import { SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

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
    return await interaction.reply("Berikan setidaknya `2 opsi`!");
  }

  const pickedChoice =
    uniqueChoices[Math.floor(Math.random() * uniqueChoices.length)];

  const pickedChoiceFmt =
    pickedChoice.startsWith("<@") && pickedChoice.endsWith(">")
      ? pickedChoice
      : `\`${pickedChoice}\``;

  const optionsText = uniqueChoices
    .map((choice) =>
      choice.startsWith("<@") && choice.endsWith(">") ? choice : `\`${choice}\``
    )
    .join(", ")
    // Replace the last comma with a ampersand
    .replace(/,\s([^,]+)$/, " & $1");

  const replyText = `Dari opsi ${optionsText}, aku memilih ${pickedChoiceFmt}!`;

  await interaction.reply(replyText);
}
