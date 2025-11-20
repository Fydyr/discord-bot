import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { PingService } from "../services/PingService";
import { bot } from "../index";

@Discord()
export class PingController {
  private pingService = new PingService();

  @Slash({ description: "Test la latence du bot", name: "ping" })
  async ping(interaction: CommandInteraction): Promise<void> {
    const start = Date.now();
    await interaction.deferReply();
    const latency = Date.now() - start;
    const apiLatency = Math.round(bot.ws.ping);

    await interaction.editReply(
      `Pong! Latence: **${latency}ms** | API: **${apiLatency}ms**`
    );
  }
}
