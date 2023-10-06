const { SlashCommandBuilder } = require("discord.js");
const formatNumber = require("../utils/formatNumber");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hitung")
    .setDescription("Aku akan menghitung input yang kamu berikan!")
    .addStringOption((option) =>
      option
        .setName("operator")
        .setDescription("Operator")
        .setRequired(true)
        .addChoices(
          {
            name: "Tambah (+)",
            value: "+",
          },
          {
            name: "Kurang (-)",
            value: "-",
          },
          {
            name: "Kali (*)",
            value: "*",
          },
          {
            name: "Bagi (/)",
            value: "/",
          },
          {
            name: "Modulus (%)",
            value: "%",
          },
          {
            name: "Eksponensial (**)",
            value: "**",
          }
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
    ),

  execute: async (interaction) => {
    const operator = interaction.options.get("operator").value;
    const firstNumber = interaction.options.get("angka-pertama").value;
    const secondNumber = interaction.options.get("angka-kedua").value;

    const result = eval(firstNumber + operator + secondNumber);

    await interaction.reply(
      `Hasil dari \`${formatNumber(firstNumber)} ${operator} ${formatNumber(
        secondNumber
      )}\` adalah \`${formatNumber(result)}\`!`
    );
  },
};
