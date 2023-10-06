const { SlashCommandBuilder } = require("discord.js");
const formatNumber = require("../utils/formatNumber");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("acak")
    .setDescription("Aku akan memilih angka acak di antara 2 input kamu!")
    .addNumberOption((option) =>
      option
        .setName("minimal")
        .setDescription("Angka Minimal")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("maksimal")
        .setDescription("Angka Maksimal")
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const min = interaction.options.get("minimal").value;
    const max = interaction.options.get("maksimal").value;

    const pickedNumber = Math.floor(Math.random() * (max - min + 1) + min);

    await interaction.reply(`Aku memilih \`${formatNumber(pickedNumber)}\`!`);
  },
};
