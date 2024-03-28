import { ActivityType, type Client } from "discord.js";

export default function (c: Client<true>) {
  const ACTIVITIES = [
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

  let currentIndex = 0;

  async function setRandomPresence() {
    const randomActivity = ACTIVITIES[currentIndex];
    c.user.setPresence({ activities: [{ ...randomActivity }], status: "idle" });

    // Use the modulo operator to ensure the index stays within the correct range
    // If the index reaches the length of the array, wrap back to the beginning (index 0)
    currentIndex = (currentIndex + 1) % ACTIVITIES.length;
  }

  // Set random presence on ready
  setRandomPresence();

  // Change presence every 5 minutes
  setInterval(setRandomPresence, 1000 * 60 * 5);
}
