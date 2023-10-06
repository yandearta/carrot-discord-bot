const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")
const extractLyrics = require("../utils/extractLyrics")
const searchGeniusSong = require("../utils/searchGeniusSong")

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lirik")
    .setDescription("Cari lirik lagu kesukaanmu!")
    .addStringOption((option) => option.setName("cari").setDescription("Pencarian").setRequired(true)),

  execute: async (interaction) => {
    await interaction.deferReply()

    const search = interaction.options.get("cari").value
    let embed = new EmbedBuilder()

    try {
      // Search song result
      const songResult = await searchGeniusSong(search)

      if (songResult) {
        // Destructure needed data
        const { full_title, song_art_image_thumbnail_url, url } = songResult

        // Extract lyric
        const lyric = await extractLyrics(url)

        const splittedLyric = lyric.split("\n")
        const filteredLyric = splittedLyric.filter((lyric) => lyric)

        // [Chorus], [Verse], [Bridge] etc...
        const isStructure = (str) => {
          return str.startsWith("[") && str.endsWith("]")
        }

        const mappedLyric = filteredLyric.map((lyric) => (isStructure(lyric) ? `\n\`${lyric}\`` : lyric))

        embed
          .setTitle(full_title)
          .setURL(url)
          .setDescription(mappedLyric.join("\n"))
          .setColor("#eade58")
          .setImage(song_art_image_thumbnail_url)
          .setTimestamp()
          .setFooter({ text: "Lirik disediakan oleh Genius", iconURL: "https://images.rapgenius.com/7273cea03410fecfd11f3703cf546b78.750x750x1.gif" })
      } else {
        // Song not found
        embed.setTitle("(｡•́︿•̀｡)").setDescription("Yaah, lirik tidak diemukan.").setColor("#eade58")
      }

      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      // Error
      embed.setTitle("(×_×)").setDescription("Maaf, ada kesalahan. Tampaknya Carrot sedang lelah, coba lagi nanti ya.").setColor("#eade58")

      await interaction.editReply({ embeds: [embed] })
      console.log(error)
    }
  },
}
