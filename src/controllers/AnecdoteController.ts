import { Discord, Slash } from "discordx";
import { CommandInteraction, PermissionFlagsBits } from "discord.js";
import { AnecdoteService } from "../services/AnecdoteService";
import { LoggerService } from "../services/LoggerService";

@Discord()
export class AnecdoteController {
  @Slash({
    name: "send-anecdote",
    description: "Envoie immédiatement une anecdote informatique dans le canal configuré",
    defaultMemberPermissions: PermissionFlagsBits.Administrator
  })
  async sendAnecdote(interaction: CommandInteraction): Promise<void> {
    await interaction.deferReply({ flags: 64 }); // 64 = EPHEMERAL flag

    try {
      await AnecdoteService.sendDailyAnecdote();
      await interaction.editReply("✅ Anecdote envoyée avec succès !");
    } catch (error) {
      await LoggerService.error(`Erreur lors de l'envoi manuel de l'anecdote: ${error}`);
      await interaction.editReply("❌ Erreur lors de l'envoi de l'anecdote. Vérifiez les logs.");
    }
  }
}
