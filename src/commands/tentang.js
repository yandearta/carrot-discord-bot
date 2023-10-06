const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
  data: new SlashCommandBuilder().setName("tentang").setDescription("Tentang Carrot!"),
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setTitle("Tentang Carrot!")
      .setURL("https://onepiece.fandom.com/id/wiki/Carrot")
      .setDescription(
        "Carrot adalah seorang gadis muda dari suku Mink Kelinci, berbulu putih berambut pirang, dengan mata cokelat, bertelinga kelinci, hidung mirip kelinci, dan ekor bulat yang panjang."
      )
      .setColor("#eade58")
      .setThumbnail("https://static.wikia.nocookie.net/onepiece/images/1/14/Carrot_Portrait.png/revision/latest")
      .setImage("https://preview.redd.it/a464085si0011.jpg?auto=webp&s=32fbc0f8d705c83d86de2a210b77b2242862d94c")

    await interaction.reply({ embeds: [embed] })
  },
}
