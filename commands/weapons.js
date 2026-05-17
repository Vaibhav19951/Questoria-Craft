const weapons = require("../asset/weapons.js");

module.exports = (bot) => {
  bot.onText(/\/weapons/, (msg) => {
    let text = "🗡 Weapon Shop\n\n";

    weapons.forEach((weapon) => {
      text += `${weapon.id}. ${weapon.name}
Damage: ${weapon.damage}
Price: ${weapon.price}\n\n`;
    });

    bot.sendMessage(msg.chat.id, text);
  });
};