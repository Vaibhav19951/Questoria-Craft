const chars = require("../asset/assets");

module.exports = (bot) => {

  bot.onText(/\/char (.+)/, (msg, match) => {
    const name = match[1].toLowerCase();
    const chatId = msg.chat.id;

    const char = chars[name];

    if (!char) {
      return bot.sendMessage(chatId, "❌ Character not found!");
    }

    bot.sendPhoto(chatId, char.img, {
      caption:
`⚔️ Name: ${char.name}
⭐ Rarity: ${char.rarity}`
    });

  });

};
