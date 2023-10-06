const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const capitalizeFirstLetter = require("../utils/capitalizeFirstLetter");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gambar")
    .setDescription("Gambar-gambar HD dari Unsplash!")
    .addStringOption((option) =>
      option.setName("cari").setDescription("Pencarian")
    )
    .addStringOption((option) =>
      option.setName("resolusi").setDescription("Resolusi (1920x1080)")
    ),

  execute: async (interaction) => {
    await interaction.deferReply();

    const search = interaction.options.get("cari")?.value;

    const resolution =
      interaction.options.get("resolusi")?.value || "1920x1080";
    const res = await fetch(
      `https://source.unsplash.com/${resolution}?${search}`
    );

    const embed = new EmbedBuilder()
      .setTitle(
        search
          ? `Hasil pencarian gambar ${capitalizeFirstLetter(search)}!`
          : "Menampilkan gambar Random!"
      )
      .setDescription(`Resolusi: ${resolution}`)
      .setImage(res.url)
      .setColor("#eade58")
      .setTimestamp()
      .setFooter({
        text: "Gambar disediakan oleh Unsplash",
        iconURL: "https://unsplash.com/favicon-32x32.png",
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
