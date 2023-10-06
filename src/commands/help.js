const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Carrot bisa ngapain aja, sih?"),

  execute: async (interaction) => {
    const commandsFields = interaction.client.commands.map((command) => {
      const commandOptions = command.data.options
        .map((option) =>
          option?.name ? `\`<${option.name.replaceAll("-", " ")}>\`` : null
        )
        .join(" ");

      return {
        name: `/${command.data.name} ${commandOptions}`,
        value: command.data.description,
      };
    });

    const embed = new EmbedBuilder()
      .setTitle("Ini daftar semua kemampuanku!")
      .setColor("#eade58")
      .setThumbnail(
        "https://i.pinimg.com/originals/d0/fe/db/d0fedb56c084ae7cf5eda2c52a29527e.jpg"
      )
      .addFields(...commandsFields)
      .setFooter({
        text: "© Carrot " + new Date().getFullYear(),
        iconURL:
          "https://cdn.discordapp.com/app-icons/1066031310583382118/6a4a2ee2a10d9632022d18cd6868328c.png?size=256",
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
