import { SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import formatNumber from "@/utils/formatNumber";

export const data = new SlashCommandBuilder()
  .setName("hitung")
  .setDescription("Aku akan menghitung input yang kamu berikan!")
  .addStringOption((option) =>
    option
      .setName("operator")
      .setDescription("Operator")
      .setRequired(true)
      .addChoices(
        { name: "Tambah (+)", value: "+" },
        { name: "Kurang (-)", value: "-" },
        { name: "Kali (*)", value: "*" },
        { name: "Bagi (/)", value: "/" },
        { name: "Modulus (%)", value: "%" },
        { name: "Eksponensial (**)", value: "**" }
      )
  )
  .addNumberOption((option) =>
    option
      .setName("angka-pertama")
      .setDescription("Angka Pertama")
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option
      .setName("angka-kedua")
      .setDescription("Angka Kedua")
      .setRequired(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const operator = interaction.options.getString("operator");
  const firstNumber = interaction.options.getNumber("angka-pertama");
  const secondNumber = interaction.options.getNumber("angka-kedua");

  if (!operator || !firstNumber || !secondNumber) {
    return errorEmbed("Operator, Angka Pertama, dan Angka Kedua harus diisi!");
  }

  const firstNumberFmt = formatNumber(firstNumber);
  const secondNumberFmt = formatNumber(secondNumber);

  const result = eval(firstNumber + operator + secondNumber);
  const resultFmt = formatNumber(result);

  await interaction.reply(
    `Hasil dari \`${firstNumberFmt} ${operator} ${secondNumberFmt}\` adalah \`${resultFmt}\`!`
  );
}
