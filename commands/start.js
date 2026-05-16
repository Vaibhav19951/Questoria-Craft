module.exports = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    await bot.sendMessage(
      chatId,
      `⚔️ *WELCOME TO DEMON SLAYER BOT* ⚔️

🔥 Collect legendary slayers
👹 Fight dangerous demons
🏆 Become the strongest warrior

Use /help to begin your journey.`,
      {
        parse_mode: "Markdown"
      }
    );
  });
};