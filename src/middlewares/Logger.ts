import { ArgsOf, GuardFunction } from "discordx";

export const LogInteraction: GuardFunction<ArgsOf<"interactionCreate">> = async (
  [interaction],
  _client,
  next
) => {
  console.log(`[${new Date().toISOString()}] Interaction: ${interaction.id} by ${interaction.user.tag}`);
  await next();
};
