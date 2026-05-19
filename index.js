console.log("🚀 FILE STARTED");
console.log("TOKEN:", process.env.BOT_TOKEN);
const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// =========================
// SAFE TOKEN CHECK
// =========================
const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.log("❌ BOT_TOKEN missing in environment variables!");
  process.exit(1);
}

// =========================
// BOT INIT (STACKHOST SAFE)
// =========================
const bot = new TelegramBot(TOKEN, {
  polling: {
    interval: 2000,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

process.on("uncaughtException", err => {
  console.log("CRASH:", err.message);
});

process.on("unhandledRejection", err => {
  console.log("PROMISE ERROR:", err.message);
}); 

// =========================
// GLOBAL ERROR HANDLING (IMPORTANT)
// =========================
process.on("uncaughtException", (err) => {
  console.log("❌ Uncaught Error:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.log("❌ Promise Error:", err.message);
});

// =========================
// SAFE COMMAND LOADER
// =========================
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {

    const filePath = path.join(commandsPath, file);

    try {
      const command = require(filePath);

      if (typeof command === "function") {
        command(bot);
        console.log(`✅ Loaded: ${file}`);
      } else {
        console.log(`⚠️ Skipped (not function): ${file}`);
      }

    } catch (err) {
      console.log(`❌ Error in ${file}:`, err.message);
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
  { command: "redeem", description: "Redeem characters" },
  { command: "guild", description: "view guild" },
  { command: "profile", description: "View your profile" },
  { command: "guild", description: "View guild" },
  { command: "myguild", description: "My guild info" },
  { command: "guildlb", description: "Guild leaderboard" },
  { command: "guide", description: "Bot guide" }
])
.then(() => console.log("📜 Menu updated"))
.catch(err => console.log("❌ Menu error:", err.message));

// =========================
// KEEP ALIVE (STACKHOST NEED)
// =========================
setInterval(() => {
  console.log("🤖 Bot alive...");
}, 30000);

// =========================
console.log("⚔️ Bot running...");
