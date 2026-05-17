module.exports = (bot) => {
  const enemiesByLevel = {
    beginner: [
      { name: "👹 Weak Demon", hp: 35, attack: 6, reward: 40 },
      { name: "🕷️ Spider Demon", hp: 45, attack: 8, reward: 55 },
      { name: "🐺 Beast Demon", hp: 42, attack: 7, reward: 50 },
      { name: "🦇 Night Demon", hp: 48, attack: 9, reward: 60 },
      { name: "☠️ Lost Soul", hp: 38, attack: 6, reward: 45 },
    ],

    intermediate: [
      { name: "🩸 Lower Moon 6", hp: 70, attack: 14, reward: 120 },
      { name: "🐍 Serpent Demon", hp: 85, attack: 16, reward: 150 },
      { name: "🕸️ Rui Clone", hp: 90, attack: 17, reward: 160 },
      { name: "🌫️ Mist Demon", hp: 88, attack: 15, reward: 145 },
      { name: "🦂 Poison Demon", hp: 95, attack: 18, reward: 170 },
    ],

    advanced: [
      { name: "🔥 Upper Moon 6", hp: 120, attack: 24, reward: 250 },
      { name: "💀 Blood Demon", hp: 140, attack: 28, reward: 320 },
      { name: "⚡ Thunder Beast", hp: 135, attack: 26, reward: 300 },
      { name: "🌑 Upper Moon 4", hp: 150, attack: 30, reward: 350 },
      { name: "🐉 Dragon Demon", hp: 165, attack: 32, reward: 400 },
    ],
  };

  bot.onText(/\/battle/, async (msg) => {
    const chatId = msg.chat.id;

    const playerLevel = Math.floor(Math.random() * 30) + 1;
    let enemyPool;

    if (playerLevel <= 10) {
      enemyPool = enemiesByLevel.beginner;
    } else if (playerLevel <= 20) {
      enemyPool = enemiesByLevel.intermediate;
    } else {
      enemyPool = enemiesByLevel.advanced;
    }

    const enemy =
      enemyPool[Math.floor(Math.random() * enemyPool.length)];

    const player = {
      hp: 100 + playerLevel * 3,
      attack: 15 + playerLevel * 2,
    };

    try {
      await bot.sendPhoto(
        chatId,
        "https://i.pinimg.com/736x/e6/48/aa/e648aa4d25e06b27a93b2bc43a796a5e.jpg",
        {
          caption: `⚔️ BATTLE BEGINS ⚔️

🧍 Level: ${playerLevel}
Enemy: ${enemy.name}

Prepare for battle...`,
        }
      );

      let playerHp = player.hp;
      let enemyHp = enemy.hp;
      let log = "";

      while (playerHp > 0 && enemyHp > 0) {
        enemyHp -= player.attack;
        log += `🗡️ You attacked ${enemy.name}\n-${player.attack} HP\n\n`;

        if (enemyHp <= 0) break;

        playerHp -= enemy.attack;
        log += `${enemy.name} attacked back!\n💥 -${enemy.attack} HP\n\n`;
      }

      if (playerHp > 0) {
        log += `🏆 Victory!\nDefeated ${enemy.name}\n💰 +${enemy.reward} Coins`;
      } else {
        log += `☠️ Defeat!\n${enemy.name} defeated you`;
      }

      setTimeout(() => {
        bot.sendMessage(chatId, log);
      }, 2000);
    } catch (error) {
      console.log(error.message);
      bot.sendMessage(chatId, "Battle failed ❌");
    }
  });
};
