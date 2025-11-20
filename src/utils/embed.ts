import { EmbedBuilder, ColorResolvable } from "discord.js";

export function createEmbed(
  title: string,
  description: string,
  color: ColorResolvable = "#5865F2"
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

export function createErrorEmbed(message: string): EmbedBuilder {
  return createEmbed("Erreur", message, "#ED4245");
}

export function createSuccessEmbed(message: string): EmbedBuilder {
  return createEmbed("Succès", message, "#57F287");
}
