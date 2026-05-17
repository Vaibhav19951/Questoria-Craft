module.exports = (bot) => {
  bot.onText(/\/profile/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      await bot.sendMessage(chatId, "👤 Profile:\nLevel: 1\nXP: 0");
    } catch (err) {
      console.log(err);
      bot.sendMessage(chatId, "Error loading profile 😓");
    }
  });
};
