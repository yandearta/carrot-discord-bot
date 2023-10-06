const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pilih")
    .setDescription("Aku akan memilih salah satu dari beberapa input kamu!")
    .addStringOption((option) =>
      option
        .setName("opsi")
        .setDescription(
          "Daftar opsi, pisahkan dengan koma (opsi 1, opsi 2 dst.)"
        )
        .setRequired(true)
    ),

  execute: async (interaction) => {
    const choices = interaction.options
      .get("opsi")
      .value.split(",")
      .map((choice) => choice.trim())
      .filter((choice) => choice);

    const uniqueChoices = [...new Set(choices)];

    if (uniqueChoices.length < 2) {
      return await interaction.reply("Berikan setidaknya `2 opsi`!");
    }

    const pickedChoice =
      uniqueChoices[Math.floor(Math.random() * uniqueChoices.length)];

    const optionsText = uniqueChoices
      .join(", ")
      // Replace the last comma with a ampersand
      .replace(/,\s([^,]+)$/, " & $1");

    const replyText = `Dari opsi ${optionsText}, aku memilih ${pickedChoice}!`;

    await interaction.reply(replyText);
  },
};
