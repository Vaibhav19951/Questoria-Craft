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
        caption: `⚔️ WELCOME TO DEMON SLAYER BOT ⚔️`,
      }
    );
  } catch (err) {
    console.log(err);
    bot.sendMessage(chatId, "Error aa gaya start image me 😓");
  }
});

console.log("Bot running...");
