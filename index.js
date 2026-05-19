const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// =========================
// SAFE COMMAND LOADER
// =========================
const commandsPath = path.join(__dirname, "commands");

// check folder exists
if (fs.existsSync(commandsPath)) {

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    const command = require(filePath);

    if (typeof command === "function") {
      command(bot);
      console.log(`✅ Loaded: ${file}`);
    } else {
      console.log(`⚠️ Skipped (not a function): ${file}`);
    }
  }

} else {
  console.log("⚠️ commands folder not found!");
}

// =========================
// MENU BUTTONS
// =========================
bot.setMyCommands([
  { command: "start", description: "Start the game" },
  { command: "help", description: "Show all commands" },
  { command: "summon", description: "Summon a character" },
  { command: "inventory", description: "View your items" },
  { command: "battle", description: "Fight a demon" },
  { command: "profile", description: "View your profile" },
  { command: "buy", description: "Shop weapons" },
  { command: "equip", description: "Equip a weapon" },
  { command: "addchar", description: "Add character" },
  { command: "char", description: "View character" },
  { command: "mythicalshop", description: "Mythical shop" },
  { command: "redeem", description: "Redeem characters" }
])
.then(() => {
  console.log("📜 Telegram menu updated!");
})
.catch(err => {
  console.log("❌ Menu error:", err.message);
});

console.log("⚔️ Bot running...");
