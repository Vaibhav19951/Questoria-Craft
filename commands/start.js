module.exports = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendPhoto(
      chatId,
      "https://wallpapercave.com/wp/wp12009969.jpg",
      {
        caption: `⚔️ *WELCOME TO DEMON SLAYER BOT* ⚔️

🔥 Collect powerful slayers
👹 Defeat dangerous demons
🎒 Build your inventory
🏆 Become the strongest warrior

Use /help to begin your journey.`,
        parse_mode: "Markdown"
      }
    );
  });
};