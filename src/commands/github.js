const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const formatNumber = require("../utils/formatNumber");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("github")
    .setDescription("Cek profil github seseorang!")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Username Github")
        .setRequired(true)
    ),

  execute: async (interaction) => {
    await interaction.deferReply();

    const username = interaction.options.get("username").value;
    let embed = new EmbedBuilder();

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();

      if (!data.message) {
        let description = "";

        if (data.bio) description += `${data.bio}`;
        if (data.twitter_username)
          description += `\n\n🐦 @${data.twitter_username}`;
        if (data.blog) description += `\n🌐 ${data.blog}`;
        if (data.location) description += `\n📍 ${data.location}`;

        description += `\n\n\`Followers: ${formatNumber(
          data.followers
        )}\` \`Following: ${formatNumber(data.following)}\``;

        description += `\n\`Public Repos: ${formatNumber(
          data.public_repos
        )}\` \`Public Gists: ${formatNumber(data.public_gists)}\``;

        embed
          .setTitle(data.name ?? data.login)
          .setURL(data.url)
          .setDescription(description)
          .setColor("#22272e")
          .setThumbnail(data.avatar_url)
          .setTimestamp()
          .setFooter({
            text: "Data disediakan oleh GitHub",
            iconURL: "https://carrot.afkteam.dev/assets/github-mark-white.png",
          });
      } else {
        // Song not found
        embed
          .setTitle("(｡•́︿•̀｡)")
          .setDescription("Yaah, user tidak ditemukan.")
          .setColor("#eade58");
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      // Error
      embed
        .setTitle("(×_×)")
        .setDescription(
          "Maaf, ada kesalahan. Tampaknya Carrot sedang lelah, coba lagi nanti ya."
        )
        .setColor("#eade58");

      await interaction.editReply({ embeds: [embed] });
      console.log(error);
    }
  },
};
