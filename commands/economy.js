const players = require("../data/players");

module.exports = (bot) => {

  // =========================
  // SAFE USER GET/CREATE
  // =========================
  const getUser = (userId) => {

    if (!players[userId]) {
      players[userId] = {
        coins: 1000,
        gems: 0,
        mythicalCrystals: 0,
        level: 1,
        xp: 0
      };
    }

    return players[userId];
  };

  // =========================
  // BALANCE
  // =========================
  bot.onText(/\/balance/, (msg) => {

    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    const p = getUser(userId);

    bot.sendMessage(chatId,
      `💰 *YOUR BALANCE*

🪙 Coins: ${p.coins}
💎 Gems: ${p.gems}
🧬 Crystals: ${p.mythicalCrystals}
📊 Level: ${p.level}
⚡ XP: ${p.xp}
      `,
      { parse_mode: "Markdown" }
    );
  });

  // =========================
  // DAILY REWARD
  // =========================
  bot.onText(/\/daily/, (msg) => {

    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    const p = getUser(userId);

    const reward = 500;
    p.coins += reward;

    bot.sendMessage(chatId, `🎁 Daily reward: +${reward} coins`);
  });

  // =========================
  // WORK (EARN + XP)
  // =========================
  bot.onText(/\/work/, (msg) => {

    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    const p = getUser(userId);

    const earn = Math.floor(Math.random() * 200) + 50;

    p.coins += earn;
    p.xp += 10;

    if (p.xp >= 100) {
      p.level += 1;
      p.xp = 0;
    }

    bot.sendMessage(chatId,
      `⚔️ You worked and earned ${earn} coins`
    );
  });

};
