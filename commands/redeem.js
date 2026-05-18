module.exports = (bot) => {
  bot.onText(/^\/redeem$/, (msg) => {
    bot.sendMessage(msg.chat.id, "Redeem is alive ✅");
  });
};
