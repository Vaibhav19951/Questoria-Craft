const mythical = require("../asset/mythical");
const players = require("../data/players");

module.exports = (bot) => {
  bot.onText(/\/redeem (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const cardId = match[1].trim();

    if (!players[userId]) {
      return bot.sendMessage(
        chatId,
        "❌ Profile not found.\nUse /start first."
      );
    }

    const player = players[userId];
    if (!player.cards) player.cards = [];
    if (!player.mythicalCrystals) player.mythicalCrystals = 0;

    const card = mythical.find(
      c => c.id.toLowerCase() === cardId.toLowerCase()
    );

    if (!card) {
      return bot.sendMessage(
        chatId,
        "❌ Invalid Card ID.\nUse /mythicalshop to check IDs."
      );
    }

    const alreadyOwned = player.cards.some(c => c.id === card.id);

    if (alreadyOwned) {
      return bot.sendMessage(
        chatId,
        `⚠️ You already own ${card.name}`
      );
    }

    if (player.mythicalCrystals < card.cost) {
      return bot.sendMessage(
        chatId,
        `❌ Not enough Mythical Crystals!\n\n` +
        `Needed: ${card.cost}\n` +
        `You Have: ${player.mythicalCrystals}`
      );
    }

    player.mythicalCrystals -= card.cost;
    player.cards.push(card);

    bot.sendPhoto(chatId, card.image, {
      caption:
        `🎉 *MYTHICAL REDEEMED!* 🎉\n\n` +
        `🎴 *${card.name}*\n` +
        `⚔️ Power: ${card.power}\n` +
        `💠 Cost: ${card.cost}\n\n` +
        `💎 Remaining Crystals: ${player.mythicalCrystals}`,
      parse_mode: "Markdown"
    });
  });
};
