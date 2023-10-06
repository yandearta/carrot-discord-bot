require("dotenv").config()
const { REST, Routes } = require("discord.js")
const fs = require("fs")
const path = require("path")

const commands = []
// Grab all the command files from the commands directory you created earlier
const commandsPath = path.join(__dirname, "commands") // Commands Folder
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js")) // All Files Inside Commands Folder

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file) // The File's Path
  const command = require(filePath)

  commands.push(command.data.toJSON())
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN)

// and deploy your commands!
;(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands })

    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error)
  }
})()
