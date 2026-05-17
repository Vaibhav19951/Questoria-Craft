const players = require("../data/players.js");

module.exports = (bot) => {
  bot.onText(/\/equip (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const weaponId = parseInt(match[1]);

    if (!players[chatId]) {
      return bot.sendMessage(chatId, "Buy a weapon first");
    }

    const weapon = players[chatId].inventory.find(
      (w) => w.id === weaponId
    );

    if (!weapon) {
      return bot.sendMessage(chatId, "You don't own this weapon");
    }

    players[chatId].equippedWeapon = weapon;

    bot.sendMessage(chatId, `Equipped ${weapon.name}`);
  });
};