const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    await bot.sendPhoto(
      chatId,
      "https://kommodo.ai/i/ip5xqtnqGqXGpuQxOpkZ",
      {
        caption: `⚔️ WELCOME TO DEMON SLAYER BOT ⚔️

🔥 Collect legendary Demon Slayers  
👹 Fight powerful demons  
🎒 Build your inventory  
🏆 Climb leaderboard  

Use /help to begin your journey.

Are you ready to become the strongest?`,
        parse_mode: "Markdown",
      }
    );
  } catch (err) {
    console.log("Error sending image:", err.message);
    bot.sendMessage(chatId, "Start image load nahi ho paaya 😓");
  }
});

console.log("Bot running...");
