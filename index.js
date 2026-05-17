const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// 1. Auto-load all command files from the /commands/ folder
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  
  // This imports the file and immediately passes (bot) into it,
  // matching exactly how we set up start.js, battle.js, etc.
  require(filePath)(bot); 
  
 console.log(`✅ Loaded: ${file}`);
}

// 2. Set the Telegram UI menu commands
bot.setMyCommands([
  { command: "start", description: "Start the game" },
  { command: "help", description: "Show all commands" },
  { command: "summon", description: "Summon a character" },
  { command: "inventory", description: "View your items" },
  { command: "battle", description: "Fight a demon" },
  { command: "profile", description: "View your profile" }
]).then(() => {
  console.log("📜 Telegram menu button updated!");
}).catch((err) => {
  console.log("Failed to set menu:", err);
});

console.log("⚔️ Bot running...");
