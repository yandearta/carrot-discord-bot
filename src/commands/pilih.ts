import {
  ActionRowBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { ButtonKit, type SlashCommandProps } from "commandkit";

import { errorEmbed } from "@/utils/statusEmbed";
import formatNumber from "@/utils/formatNumber";

export const data = new SlashCommandBuilder()
  .setName("pilih")
  .setDescription("Aku akan memilih salah satu dari beberapa input kamu!")
  .addStringOption((option) =>
    option
      .setName("opsi")
      .setDescription("Daftar opsi, pisahkan dengan koma (opsi 1, opsi 2 dst.)")
      .setRequired(true)
  );

export async function run({ interaction }: SlashCommandProps) {
  const message = await interaction.deferReply({ fetchReply: true });

  const choices = interaction.options.getString("opsi");
  const choicesFmt = choices
    ?.split(",")
    .map((choice) => choice.trim())
    .filter((choice) => choice);

  const uniqueChoices = [...new Set(choicesFmt)];

  if (uniqueChoices.length < 2) {
    return await interaction.editReply({
      embeds: [errorEmbed("Berikan setidaknya 2 opsi unik!")],
    });
  }

  let shuffled = 0;
  const [reshuffleButton, shuffledButton] = createButtons(shuffled);

  const row = new ActionRowBuilder<ButtonKit>().addComponents(
    reshuffleButton,
    shuffledButton
  );

  await sendResults(uniqueChoices, interaction, row);

  reshuffleButton.onClick(
    async (buttonInteraction) => {
      await buttonInteraction.deferUpdate();

      if (buttonInteraction.user.id !== interaction.user.id) {
        const message = await buttonInteraction.followUp(
          `<@${buttonInteraction.user.id}>, Hanya user yang menjalankan command ini yang diizinkan untuk mengacak ulang pilihan!`
        );

        setTimeout(async () => await message.delete(), 5000);
        return;
      }

      shuffled++;
      await sendResults(uniqueChoices, interaction, row, true, shuffled);
    },
    { message, time: 10 * 60 * 1000 } // 10 minutes
  );

  reshuffleButton.onEnd(() => {
    reshuffleButton.setDisabled();
    const channel = interaction.guild?.channels.cache.get(message.channelId);
    if (channel) message.edit({ components: [row] }); // Prevent error when the channel is not found
  });
}

async function sendResults(
  uniqueChoices: string[],
  interaction: SlashCommandProps["interaction"],
  row: ActionRowBuilder<ButtonKit>,
  isReshuffle = false,
  shuffled = 0
) {
  const pickedChoiceIndex = Math.floor(Math.random() * uniqueChoices.length);
  const pickedChoice = uniqueChoices[pickedChoiceIndex];

  const choicesDisplay = uniqueChoices
    .map((choice, i) => `${formatNumber(i)}. ${choice}`)
    .join("\n");

  const pickedChoiceFmt =
    pickedChoice.startsWith("<@") && pickedChoice.endsWith(">")
      ? pickedChoice
      : `**${pickedChoice}**`;

  const description = `
      Dari ${uniqueChoices.length} opsi:\n
      ${choicesDisplay}\n
      Aku memilih no ${formatNumber(pickedChoiceIndex + 1)}: ${pickedChoiceFmt}!
`;

  const embed = new EmbedBuilder()
    .setTitle("Pemilih Acak!")
    .setThumbnail(
      "https://hccpbrwnmejpnfjtipeh.supabase.co/storage/v1/object/public/carrot/dice.png"
    )
    .setDescription(description);

  if (isReshuffle) {
    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription("Mengacak ulang...")],
    });

    // Wait for 0.5 seconds before sending the results
    setTimeout(async () => {
      row.setComponents(createButtons(shuffled));
      await sendResults(uniqueChoices, interaction, row);
    }, 500);
  } else {
    await interaction.editReply({ embeds: [embed], components: [row] });
  }
}

function createButtons(shuffled: number) {
  const reshuffleButton = new ButtonKit()
    .setCustomId("reshuffle")
    .setLabel("🔄️ Acak Ulang")
    .setStyle(ButtonStyle.Primary);

  const shuffledButton = new ButtonKit()
    .setCustomId("shuffled")
    .setLabel(`Diacak: ${formatNumber(shuffled)}x`)
    .setStyle(ButtonStyle.Primary)
    .setDisabled(true);

  return [reshuffleButton, shuffledButton];
}
