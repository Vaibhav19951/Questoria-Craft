const players = require("../data/players.js");

module.exports = (bot) => {
  bot.onText(/\/equip (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const weaponId = parseInt(match[1]);

    const player = players[chatId];

    if (!player) {
      return bot.sendMessage(chatId, "❌ No player data found");
    }

    const weapon = player.inventory.find((w) => w.id === weaponId);

    if (!weapon) {
      return bot.sendMessage(chatId, "❌ You don't own this weapon");
    }

    player.equippedWeapon = weapon;

    bot.sendMessage(
      chatId,
      `⚔️ Equipped successfully!

Weapon: ${weapon.name}`
    );
  });
};
