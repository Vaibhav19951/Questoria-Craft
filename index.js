require("dotenv").config();

console.log("🚀 FILE STARTED");

const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");

// =========================
// SAFE TOKEN CHECK
// =========================
const TOKEN = process.env.BOT_TOKEN;

console.log("TOKEN LOADED:", !!TOKEN);

if (!TOKEN) {
  console.log("❌ BOT_TOKEN missing!");
  process.exit(1);
}

// =========================
// BOT INIT
// =========================
const bot = new TelegramBot(TOKEN, {
  polling: true
});

// =========================
// GLOBAL ERROR HANDLING
// =========================
process.on("uncaughtException", err => {
  console.log("❌ CRASH:", err.message);
});

process.on("unhandledRejection", err => {
  console.log("❌ PROMISE ERROR:", err.message);
});

// =========================
// SINGLE CLEAN COMMAND LOADER
// =========================
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    // 🛑 SMOOTHLY SKIP ASSET FILES SO THEY DO NOT TRIGGER ERRORS
    if (file === "assets.js" || file === "mythical.js" || file === "weapon.js") {
      continue; 
    }

    try {
      const cmd = require(`./commands/${file}`);
      if (typeof cmd === "function") {
        cmd(bot);
        console.log("✅ Loaded:", file);
      } else {
        console.log("⚠️ Skipped non-executable file:", file);
      }
    } catch (e) {
      console.log("❌ Error:", file, e.message);
    }
  }
}

// =========================
// COMMAND MENU
// =========================
bot.setMyCommands([
  { command: "start", description: "Start the game" },
  { command: "help", description: "Show all commands" },

  { command: "balance", description: "Check balance" },
  { command: "daily", description: "Claim reward" },
  { command: "work", description: "Earn coins" },
  { command: "deposit", description: "Deposit coins" },

  { command: "guild", description: "Guild system" },
  { command: "guildlb", description: "Guild leaderboard" },

  { command: "battle", description: "Fight demons" },
  { command: "summon", description: "Summon character" },

  { command: "profile", description: "View profile" }
])
.then(() => console.log("📜 Menu loaded"))
.catch(err => console.log("❌ Menu error:", err.message));

// =========================
// RUNNING CHECKS
// =========================
setInterval(() => {
  console.log("🤖 Bot alive...");
}, 30000);

console.log("⚔️ Bot running...");