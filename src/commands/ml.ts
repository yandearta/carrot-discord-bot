import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import logger from "@/utils/logger";

export const data = new SlashCommandBuilder()
  .setName("ml")
  .setDescription("Cek username Mobile Legend!")
  .addStringOption((option) =>
    option
      .setName("user-id")
      .setDescription("User ID dari Mobile Legend (contoh: 123456789)")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("zone-id")
      .setDescription("Zone ID dari Mobile Legend (contoh: 1234)")
      .setRequired(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  await interaction.deferReply();

  const userId = interaction.options.getString("user-id");
  const zoneId = interaction.options.getString("zone-id");

  if (!userId || !zoneId) {
    return errorEmbed("User ID dan Zone ID harus diisi!");
  }

  let embed = new EmbedBuilder();

  try {
    const response = await fetch("https://order-sg.codashop.com/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        voucherTypeName: "MOBILE_LEGENDS",
        userId,
        zoneId,
      }),
    });

    const data = await response.json();

    if (data.result) {
      embed
        .setTitle("Sukses!")
        .addFields(
          {
            name: "Username",
            value: decodeURIComponent(data.result.username),
          },
          { name: "User ID", value: userId, inline: true },
          { name: "Zone ID", value: zoneId, inline: true }
        )
        .setColor("#4caf4f")
        .setThumbnail("https://carrot.afkteam.dev/mobile-legends.jpg")
        .setTimestamp()
        .setFooter({
          text: "Data disediakan oleh Mobile Legends",
          iconURL: "https://carrot.afkteam.dev/mobile-legends.jpg",
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
