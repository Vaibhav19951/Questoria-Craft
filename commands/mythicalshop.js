const players = require("../data/player");
const mythical = require("../asset/mythical");

module.exports = (bot) => {
  bot.onText(/^\/mythicalshop$/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (!players[userId]) {
      return bot.sendMessage(chatId, "❌ Use /start first.");
    }

    const crystals = players[userId].mythicalCrystals || 0;

    await bot.sendMessage(
      chatId,
      `💎 MYTHICAL SHOP 💎\n\nYour Crystals: ${crystals}`
    );

    for (const card of mythical) {
      await bot.sendPhoto(chatId, card.image, {
        caption:
          `🎴 ${card.name}\n` +
          `🆔 ${card.id}\n` +
          `⚔️ Power: ${card.power}\n` +
          `💠 Cost: ${card.cost} Crystals`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🖼 View Card Image",
                url: card.image
              }
            ]
          ]
        }
      });
    }

    bot.sendMessage(
      chatId,
      "Redeem using:\n/redeem card_id"
    );
  });
};
