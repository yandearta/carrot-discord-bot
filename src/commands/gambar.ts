import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import capitalizeFirstLetter from "@/utils/capitalizeFirstLetter";

export const data = new SlashCommandBuilder()
  .setName("gambar")
  .setDescription("Gambar-gambar HD dari Unsplash!")
  .addStringOption((option) =>
    option.setName("cari").setDescription("Pencarian")
  )
  .addStringOption((option) =>
    option.setName("resolusi").setDescription("Resolusi (1920x1080)")
  );

export async function run({ interaction }: SlashCommandProps) {
  await interaction.deferReply();

  const search = interaction.options.getString("cari");

  if (!search) {
    return interaction.editReply({
      embeds: [errorEmbed("Pencarian harus diisi!")],
    });
  }

  const resolution = interaction.options.get("resolusi")?.value || "1920x1080";
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
}
