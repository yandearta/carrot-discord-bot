const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder().setName("jokes").setDescription("Carrot juga bisa ngejokes!"),
  execute: async (interaction) => {
    await interaction.deferReply()
    try {
      const res = await fetch("https://candaan-api.vercel.app/api/text/random")
      const data = await res.json()

      const embed = new EmbedBuilder().setTitle("Carrot Jokes!").setDescription(data.data).setColor("#eade58")

      await interaction.editReply({ embeds: [embed] })
    } catch (error) {
      const embed = new EmbedBuilder()
        .setTitle("(×_×)")
        .setDescription("Maaf, ada kesalahan. Tampaknya Carrot sedang lelah, coba lagi nanti ya.")
        .setColor("#eade58")

      await interaction.editReply({ embeds: [embed] })
      console.log(error)
    }
  },
}
