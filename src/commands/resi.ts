import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import type { SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import logger from "@/utils/logger";
import formatNumber from "@/utils/formatNumber";
import env from "@/utils/env";

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

    const data = (await response.json()).sicepat.result as Resi;

    let description = "";
    description += `No. Resi: ${censorString(data.waybill_number)}\n`;
    description += `Nama Pengirim: ${censorString(data.sender)} (${
      data.sender_address
    })\n`;
    description += `Nama Penerima: ${censorString(data.receiver_name)} (${
      data.receiver_address
    })\n`;
    description += `Ongkos Kirim: Rp${formatNumber(data.totalprice)}\n`;
    description += `Tanggal Dikirim: ${data.send_date}\n\n`;
    description += `**Riwayat Pengiriman**\n\n`;

    data.track_history.forEach((history, i) => {
      description += `${history.date_time} (**${history.status}**)\n`;

      if (history.city) {
        let city = history.city;

        if (history.city.includes("Paket dibawa")) {
          city = `Paket dibawa [SIGESIT - ${censorCourier(history.city)}]`;
        }

        if (history.city.includes("Paket telah di pick up oleh")) {
          city = `Paket telah di pick up oleh [SIGESIT - ${censorCourier(
            history.city
          )}]`;
        }

        description += `${city}\n`;
      }

      if (history.receiver_name) {
        let receiver = history.receiver_name;
        if (history.receiver_name.includes("Paket diterima")) {
          receiver = `Paket diterima oleh [${censorReceiver(
            history.receiver_name
          )} - (YBS) Yang Bersangkutan]`;
        }
        description += `${receiver}\n`;
      }

      if (i !== data.track_history.length - 1) {
        description += `> ‎\n`;
      }
    });

    embed
      .setTitle("Cek Resi SiCepat")
      .setDescription(description)
      .setColor("#d5232b")
      .setThumbnail(`${env.STORAGE_URL}/sicepat-logo-red.png`)
      .setTimestamp()
      .setFooter({
        text: "Data disediakan oleh SiCepat",
        iconURL: `${env.STORAGE_URL}/sicepat-logo-red.png`,
      });

    await interaction.deleteReply();
    await interaction.channel?.send({ embeds: [embed] });
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

function censorString(input: string) {
  return input
    .split(" ")
    .map((word) => {
      if (word.length > 2) {
        const firstLetter = word.charAt(0);
        const remainingLetters = "\\*".repeat(word.length - 1);
        return `${firstLetter}${remainingLetters}`;
      } else {
        return word;
      }
    })
    .join(" ");
}

function censorCourier(city: string) {
  const regex = /\[SIGESIT - (.*?)\]/;
  const match = city.match(regex);

  if (!match) return city;
  return censorString(match[1]);
}

function censorReceiver(receiver: string) {
  const regex = /\[(.*?) - \(YBS\)/;
  const match = receiver.match(regex);

  if (!match) return receiver;
  return censorString(match[1]);
}

type Resi = {
  waybill_number: string;
  service: string;
  weight: number;
  partner: string;
  sender: string;
  sender_address: string;
  receiver_address: string;
  receiver_name: string;
  totalprice: number;
  POD_receiver: string;
  POD_receiver_time: string;
  send_date: string;
  track_history: {
    date_time: string;
    status: string;
    city?: string;
    receiver_name?: string;
  }[];
  last_status: {
    date_time: string;
    status: string;
    receiver_name: string;
  };
};
