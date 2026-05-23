console.log("✅ BATTLE SYSTEM LOADED WITH REWARDS");

const fs = require("fs");
const path = require("path");
const demons = require("../asset/demons");

const playerFile = path.join(__dirname, "../data/players.json");

// LOAD DATA SAFELY
let players = {};
try { players = JSON.parse(fs.readFileSync(playerFile, "utf8")); } catch { players = {}; }

// SAVE DATA SAFELY
const savePlayers = () => fs.writeFileSync(playerFile, JSON.stringify(players, null, 2));

// SAFE PLAYER INIT
const getPlayer = (userId) => {
  if (!players[userId]) {
    players[userId] = {
      coins: 1000,
      tokens: 0,
      level: 1,
      xp: 0,
      guildId: null,
      lastDaily: 0
    };
    savePlayers();
  }
  return players[userId];
};

// Save active battles
const battles = {};

module.exports = (bot) => {

  // =========================
  // ⚔️ /battle
  // =========================
  bot.onText(/\/battle/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString(); // Using string for JSON matching

    // Prevent multiple battles
    if (battles[userId]) {
      return bot.sendMessage(chatId, "⚠️ You are already in a battle!");
    }

    // Ensure they have a profile created before fighting
    getPlayer(userId);

    // Random demon
    const demon = demons[Math.floor(Math.random() * demons.length)];

    // Player Data
    battles[userId] = {
      demon,
      playerHp: 150,
      demonHp: demon.hp,
      shield: false,
    };

    // Send demon
    await bot.sendPhoto(chatId, demon.image, {
      caption: `👹 **A Demon Appeared!**\n\n🏷 **Name:** ${demon.name}\n⚡ **Rank:** ${demon.rank}\n🔥 **Type:** ${demon.type}\n\n❤️ **HP:** ${demon.hp}\n🗡 **ATK:** ${demon.attack}\n🛡 **DEF:** ${demon.defense}\n\nWhat will you do?`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "⚔️ Slay", callback_data: "slay" },
            { text: "🏃 Run", callback_data: "run" }
          ]
        ]
      }
    });
  });

  // =========================
  // 🔘 BUTTONS
  // =========================
  bot.on("callback_query", async (query) => {
    const data = query.data;
    const msg = query.message;
    const chatId = msg.chat.id;
    const userId = query.from.id.toString(); // Using string matching

    // No active battle
    if (!battles[userId]) {
      return bot.answerCallbackQuery(query.id, { text: "No active battle!" });
    }

    const battle = battles[userId];
    const demon = battle.demon;

    // =========================
    // 🏃 RUN
    // =========================
    if (data === "run") {
      delete battles[userId];
      await bot.editMessageCaption(`🏃 You escaped safely from ${demon.name}!`, {
        chat_id: chatId,
        message_id: msg.message_id,
      });
      return bot.answerCallbackQuery(query.id);
    }

    // =========================
    // ⚔️ START FIGHT
    // =========================
    if (data === "slay") {
      await bot.editMessageCaption(
        `⚔️ **Battle Started Against ${demon.name}!**\n\n❤️ Your HP: ${battle.playerHp}\n👹 Demon HP: ${battle.demonHp}`,
        {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: "🗡 Attack", callback_data: "attack" },
                { text: "🛡 Shield", callback_data: "shield" }
              ],
              [
                { text: "🏃 Run", callback_data: "run" }
              ]
            ]
          }
        }
      );
      return bot.answerCallbackQuery(query.id);
    }

    // =========================
    // 🛡 SHIELD
    // =========================
    if (data === "shield") {
      battle.shield = true;
      return bot.answerCallbackQuery(query.id, { text: "🛡 Shield Activated! Damage will be halved next turn." });
    }

    // =========================
    // 🗡 ATTACK
    // =========================
    if (data === "attack") {
      // Player attack
      const playerDamage = Math.floor(Math.random() * 20) + 15;
      battle.demonHp -= playerDamage;

      let text = `🗡 You attacked ${demon.name}\n💥 **${playerDamage} damage!**\n\n👹 Demon HP: ${Math.max(0, battle.demonHp)}\n❤️ Your HP: ${battle.playerHp}\n\n`;

      // DEMON DEFEATED (REWARDS MATRIX ADDED HERE)
      if (battle.demonHp <= 0) {
        delete battles[userId];

        // Fetch user data & add math rewards
        const player = getPlayer(userId);
        const rewardCoins = Math.abs(Number(demon.reward)) || 50;
        const rewardXp = Math.abs(Number(demon.exp)) || 20;

        player.coins += rewardCoins;
        player.xp += rewardXp;

        text += `🏆 **YOU WON!**\n\n💰 **+${rewardCoins} Coins**\n✨ **+${rewardXp} EXP**`;

        // Automated Level Up Logic (Every 100 XP = 1 Level)
        const xpNeeded = player.level * 100;
        if (player.xp >= xpNeeded) {
          player.level += 1;
          player.xp -= xpNeeded; // Keep remainder XP
          text += `\n\n🎉 **LEVEL UP!** You are now **Level ${player.level}**!`;
        }

        // Write changes to players.json database
        savePlayers();

        await bot.editMessageCaption(text, {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: "Markdown"
        });

        return bot.answerCallbackQuery(query.id);
      }

      // Demon attack
      let demonDamage = Math.floor(Math.random() * (demon.attack || 15)) + 5;

      // Shield reduces damage
      if (battle.shield) {
        demonDamage = Math.floor(demonDamage / 2);
        battle.shield = false;
        text += `🛡 **Shield reduced incoming damage!**\n\n`;
      }

      battle.playerHp -= demonDamage;
      text += `👹 ${demon.name} countered and attacked!\n💥 **${demonDamage} damage!**\n\n❤️ Your HP: ${Math.max(0, battle.playerHp)}`;

      // PLAYER DEFEATED
      if (battle.playerHp <= 0) {
        delete battles[userId];
        text += `\n\n☠️ **You were defeated by the demon... Train harder!**`;

        await bot.editMessageCaption(text, {
          chat_id: chatId,
          message_id: msg.message_id,
          parse_mode: "Markdown"
        });
        return bot.answerCallbackQuery(query.id);
      }

      // Continue battle loop
      await bot.editMessageCaption(text, {
        chat_id: chatId,
        message_id: msg.message_id,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🗡 Attack", callback_data: "attack" },
              { text: "🛡 Shield", callback_data: "shield" }
            ],
            [
              { text: "🏃 Run", callback_data: "run" }
            ]
          ]
        }
      });

      return bot.answerCallbackQuery(query.id);
    }
  });
};
