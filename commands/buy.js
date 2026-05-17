const weapons = require("../asset/weapons.js");
const players = require("../data/players.js");

module.exports = (bot) => {

  // /buy -> show shop
  bot.onText(/^\/buy$/, (msg) => {
    const chatId = msg.chat.id;

    let text = "🛒 BUY WEAPONS\n\n";

    weapons.forEach((weapon) => {
      text += `${weapon.id}. ${weapon.name}
Damage: ${weapon.damage}
Price: ${weapon.price} Gold\n\n`;
    });

    text += "Buy using: /buy weapon_id";

    bot.sendMessage(chatId, text);
  });

  // /buy 2 -> purchase
  bot.onText(/\/buy (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const weaponId = parseInt(match[1]);

    if (!players[chatId]) {
      players[chatId] = {
        gold: 1000,
        inventory: [],
        equippedWeapon: null,
      };
    }

    const player = players[chatId];
    const weapon = weapons.find((w) => w.id === weaponId);

    if (!weapon) return bot.sendMessage(chatId, "❌ Weapon not found");

    if (player.gold < weapon.price) {
      return bot.sendMessage(chatId, "❌ Not enough gold");
    }

    player.gold -= weapon.price;
    player.inventory.push(weapon);

    bot.sendMessage(
      chatId,
      `✅ Purchased ${weapon.name}

💰 Gold Left: ${player.gold}
Use /equip ${weapon.id}`
    );
  });
};