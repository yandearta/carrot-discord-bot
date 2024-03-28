import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";

export const data = new SlashCommandBuilder()
  .setName("resi")
  .setDescription("Cek resi paket SiCepat!")
  .addStringOption((option) =>
    option.setName("no-resi").setDescription("No Resi").setRequired(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  await interaction.deferReply({ ephemeral: true });
  let embed = new EmbedBuilder();

  try {
    const trackingNumber = interaction.options.getString("no-resi");

    if (!trackingNumber) {
      return interaction.editReply({
        embeds: [errorEmbed("No Resi harus diisi!")],
      });
    }

    const response = await fetch(
      `https://content-main-api-production.sicepat.com/public/check-awb/${trackingNumber}`
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = (await response.json()).sicepat.result;

    let description = "";
    description += censorString("Tes Tis Tes Tis");

    console.log(data);

    embed
      .setTitle("Tes")
      // .setURL(data.html_url)
      .setDescription(description)
      // .setColor("#22272e")
      // .setThumbnail(data.avatar_url)
      .setTimestamp()
      .setFooter({
        text: "Data disediakan oleh SiCepat",
        //   iconURL: "https://carrot.afkteam.dev/assets/github-mark-white.png",
      });

    await interaction.deleteReply();
    await interaction.channel?.send({ embeds: [embed] });
  } catch (error) {
    embed
      .setTitle("(×_×)")
      .setDescription(
        "Maaf, ada kesalahan. Tampaknya Carrot sedang lelah, coba lagi nanti ya."
      )
      .setColor("#f44336");

    await interaction.editReply({ embeds: [embed] });
    console.log(error);
  }
}

function censorString(input: string) {
  return input
    .split(" ")
    .map((word) => {
      if (word.length > 2) {
        const firstLetter = word.charAt(0);
        const remainingLetters = "*".repeat(word.length - 1);
        return `${firstLetter}${remainingLetters}`;
      } else {
        return word;
      }
    })
    .join(" ");
}
