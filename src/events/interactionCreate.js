const { Events } = require("discord.js");
const getCurrentTime = require("../utils/getCurrentTime");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    // If command not found, log error and return
    if (!command) {
      return console.error(
        `[ERROR] No command matching /${interaction.commandName} was found.`
      );
    }

    try {
      await command.execute(interaction);

      const username =
        interaction.member?.user.username ?? interaction.user.username;

      const discriminator =
        interaction.member?.user.discriminator ??
        interaction.user.discriminator;

      const guildName = interaction.member?.guild.name ?? "Direct Message";

      console.log(
        `[${getCurrentTime()}] [INFO] User ${username}#${discriminator} running command /${
          interaction.commandName
        } in [${guildName}]`
      );
    } catch (error) {
      console.error(
        `[${getCurrentTime()}] [ERROR] Failed executing /${
          interaction.commandName
        }`
      );
      console.error(error);
    }
  },
};
