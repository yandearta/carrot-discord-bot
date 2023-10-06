const { Events, ActivityType } = require("discord.js");
const getRandomArray = require("../utils/getRandomArray");
const getCurrentTime = require("../utils/getCurrentTime");

const ACTIVIIES = [
  {
    name: "ASMR Carrots",
    type: ActivityType.Watching,
  },
  {
    name: "Food Vlogger",
    type: ActivityType.Watching,
  },
  {
    name: "Netflix",
    type: ActivityType.Watching,
  },
  {
    name: "Anime",
    type: ActivityType.Watching,
  },
  {
    name: "😶",
    type: ActivityType.Watching,
  },
  {
    name: "Lofi Girl",
    type: ActivityType.Listening,
  },
  {
    name: "Spotify",
    type: ActivityType.Listening,
  },
  {
    name: "好きだから。",
    type: ActivityType.Listening,
  },
  {
    name: "Minecraft",
    type: ActivityType.Playing,
  },
  {
    name: "VALORANT",
    type: ActivityType.Playing,
  },
  {
    name: "Roblox",
    type: ActivityType.Playing,
  },
  {
    name: "Genshin Impact",
    type: ActivityType.Playing,
  },
  {
    name: "Visual Studio Code",
    type: ActivityType.Playing,
  },
];

const STATUSES = ["online", "idle", "dnd"];

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(
      `[${getCurrentTime()}] [INFO] Ready! Logged in as ${client.user.tag}`
    );

    const setRandomPresence = () => {
      const randomActivity = getRandomArray(ACTIVIIES);
      // const randomStatus = getRandomArray(STATUSES);

      client.user.setPresence({
        activities: [{ ...randomActivity }],
        status: STATUSES[1],
      });

      console.log(
        `[${getCurrentTime()}] [INFO] User activity changed to ${
          ActivityType[randomActivity.type]
        } ${randomActivity.name}`
      );
    };

    setRandomPresence();

    // Change presence every 5 minutes
    setInterval(() => setRandomPresence(), 1000 * 60 * 5);
  },
};
