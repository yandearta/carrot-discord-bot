import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import logger from "@/utils/logger";
import searchGeniusSong from "@/utils/searchGeniusSong";
import extractLyrics from "@/utils/extractLyrics";

export const data = new SlashCommandBuilder()
  .setName("lirik")
  .setDescription("Cari lirik lagu kesukaanmu!")
  .addStringOption((option) =>
    option.setName("cari").setDescription("Pencarian").setRequired(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  await interaction.deferReply();

  const search = interaction.options.getString("cari");

  if (!search) {
    return interaction.editReply({
      embeds: [errorEmbed("Pencarian harus diisi!")],
    });
  }

  let embed = new EmbedBuilder();

  try {
    // Search song result
    const songResult = await searchGeniusSong(search);

    if (songResult) {
      // Destructure needed data
      const { full_title, song_art_image_thumbnail_url, url } = songResult;

      // Extract lyric
      const lyric = await extractLyrics(url);
      if (!lyric) {
        throw new Error("Lirik tidak ditemukan");
      }

      const splittedLyric = lyric.split("\n");
      const filteredLyric = splittedLyric.filter((lyric) => lyric);

      // [Chorus], [Verse], [Bridge] etc...
      function isStructure(str: string) {
        return str.startsWith("[") && str.endsWith("]");
      }

      const mappedLyric = filteredLyric.map((lyric) =>
        isStructure(lyric) ? `\n\`${lyric}\`` : lyric
      );

      embed
        .setTitle(full_title)
        .setURL(url)
        .setDescription(mappedLyric.join("\n"))
        .setColor("#eade58")
        .setImage(song_art_image_thumbnail_url)
        .setTimestamp()
        .setFooter({
          text: "Lirik disediakan oleh Genius",
          iconURL:
            "https://images.rapgenius.com/7273cea03410fecfd11f3703cf546b78.750x750x1.gif",
        });
    } else {
      // Song not found
      embed
        .setTitle("(｡•́︿•̀｡)")
        .setDescription("Yaah, lirik tidak ditemukan.")
        .setColor("#eade58");
    }

    await interaction.editReply({ embeds: [embed] });
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
