import { EmbedBuilder } from "discord.js";

export function successEmbed(description: string | null) {
  return new EmbedBuilder().setColor("Green").setDescription(description);
}

export function errorEmbed(description: string | null) {
  return new EmbedBuilder()
    .setColor("Red")
    .setTitle("(｡•́︿•̀｡)")
    .setDescription(description);
}
