import type { Client } from "discord.js";
import logger from "@/utils/logger";

export default function (c: Client<true>) {
  logger.info(`Ready! Logged in as ${c.user.username}`);
}
