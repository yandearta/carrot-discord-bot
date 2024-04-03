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
      embeds: [errorEmbed("Berikan setidaknya 2 opsi!")],
    });
  }

  const reshuffleButton = new ButtonKit()
    .setCustomId(`reshuffle`)
    .setLabel("🔄️ Acak Ulang")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonKit>().addComponents(reshuffleButton);

  await sendResults(uniqueChoices, interaction, row);

  reshuffleButton
    .onClick(
      async (buttonInteraction) => {
        await buttonInteraction.deferUpdate();
        await sendResults(uniqueChoices, interaction, row, true);
      },
      { message, time: 10 * 60 * 1000 }
    ) // 10 minutes
    .onEnd(() => {
      reshuffleButton.setDisabled();
      const channel = interaction.guild?.channels.cache.get(message.channelId);
      if (channel) message.edit({ components: [row] }); // Prevent error when the channel is not found
    });
}

async function sendResults(
  uniqueChoices: string[],
  interaction: SlashCommandProps["interaction"],
  row: ActionRowBuilder<ButtonKit>,
  isReshuffle = false
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
    .setThumbnail("https://carrot.afkteam.dev/dice.png")
    .setDescription(description);

  if (isReshuffle) {
    await interaction.editReply({
      embeds: [new EmbedBuilder().setDescription("Mengacak ulang...")],
    });

    setTimeout(async () => {
      await sendResults(uniqueChoices, interaction, row);
    }, 500); // Wait for 0.5 seconds before sending the results
  } else {
    await interaction.editReply({ embeds: [embed], components: [row] });
  }
}
