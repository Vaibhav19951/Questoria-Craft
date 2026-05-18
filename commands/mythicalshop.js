const mythical = require("../asset/mythical");
const players = require("../asset/players");

module.exports = (bot) => {
  bot.onText(/\/mythicalshop/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (!players[userId]) {
      return bot.sendMessage(
        chatId,
        "❌ Profile not found.\nUse /start first."
      );
    }

    const player = players[userId];
    let text = `💎 *MYTHICAL SHOP* 💎\n`;
    text += `━━━━━━━━━━━━━━\n`;
    text += `💠 Your Crystals: *${player.mythicalCrystals || 0}*\n\n`;

    mythical.forEach((card, index) => {
      text += `${index + 1}. 🎴 *${card.name}*\n`;
      text += `🆔 \`${card.id}\`\n`;
      text += `⚔️ Power: ${card.power}\n`;
      text += `💠 Cost: ${card.cost} Crystals\n`;
      text += `━━━━━━━━━━━━━━\n`;
    });

    text += `\n🛒 Redeem using:\n`;
    text += `\`/redeem card_id\``;

    bot.sendMessage(chatId, text, {
      parse_mode: "Markdown"
    });
  });
};
