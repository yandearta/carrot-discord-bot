import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import formatNumber from "@/utils/formatNumber";
import logger from "@/utils/logger";
import env from "@/utils/env";

export const data = new SlashCommandBuilder()
  .setName("github")
  .setDescription("Cek profil github seseorang!")
  .addStringOption((option) =>
    option
      .setName("username")
      .setDescription("Username Github")
      .setRequired(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  await interaction.deferReply();

  const username = interaction.options.getString("username");

  if (!username) {
    return await interaction.editReply({
      embeds: [errorEmbed("Username harus diisi!")],
    });
  }

  let embed = new EmbedBuilder();

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();

    if (!data.message) {
      let description = "";

      if (data.bio) description += `${data.bio}\n\n`;
      if (data.twitter_username)
        description += `🐦 @${data.twitter_username}\n`;
      if (data.blog) description += `🌐 ${data.blog}\n`;
      if (data.location) description += `📍 ${data.location}\n\n`;

      description += `\`Followers: ${formatNumber(
        data.followers
      )}\` \`Following: ${formatNumber(data.following)}\`\n`;

      description += `\`Public Repos: ${formatNumber(
        data.public_repos
      )}\` \`Public Gists: ${formatNumber(data.public_gists)}\``;

      embed
        .setTitle(data.name ?? data.login)
        .setURL(data.html_url)
        .setDescription(description)
        .setColor("#22272e")
        .setThumbnail(data.avatar_url)
        .setTimestamp()
        .setFooter({
          text: "Data disediakan oleh GitHub",
          iconURL: `${env.STORAGE_URL}/github-mark-white.png`,
        });
    } else {
      embed
        .setTitle("(｡•́︿•̀｡)")
        .setDescription("Yaah, user tidak ditemukan.")
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
