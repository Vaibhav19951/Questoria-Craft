console.log("⚔️ BATTLE SYSTEM ONLINE (VELIX OS V2.5) - FIXED TOTAL");

const fs = require("fs");
const path = require("path");
const demons = require("../asset/demons");

const playerFile = path.join(__dirname, "../data/players.json");

const battles = {};

module.exports = (bot) => {
  bot.onText(/\/battle/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (battles[userId]) return bot.sendMessage(chatId, "⚠️ You are already in a battle!");

    const demon = demons[Math.floor(Math.random() * demons.length)];
    battles[userId] = { demon, playerHp: 150, demonHp: demon.hp, shield: false };

    await bot.sendPhoto(chatId, demon.image, {
      caption: `👹 **A Demon Appeared!**\n\n🏷 **Name:** ${demon.name}\n❤️ **HP:** ${demon.hp}\n🗡 **ATK:** ${demon.attack}\n\nWhat will you do?`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [[{ text: "⚔️ Slay", callback_data: "slay" }, { text: "🏃 Run", callback_data: "run" }]]
      }
    });
  });

  bot.on("callback_query", async (query) => {
    const validBattleButtons = ["slay", "run", "attack", "shield"];
    if (!validBattleButtons.includes(query.data)) return;

    const userId = query.from.id.toString();
    if (!battles[userId]) return bot.answerCallbackQuery(query.id, { text: "❌ No active battle!", show_alert: true });

    const battle = battles[userId];
    const demon = battle.demon;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    if (query.data === "run") {
      delete battles[userId];
      await bot.editMessageCaption(`🏃 You escaped safely from ${demon.name}!`, { chat_id: chatId, message_id: messageId });
    } 
    else if (query.data === "slay") {
      await bot.editMessageCaption(`⚔️ **Battle Started Against ${demon.name}!**\n\n❤️ Your HP: ${battle.playerHp}\n👹 Demon HP: ${battle.demonHp}`, {
        chat_id: chatId, message_id: messageId, parse_mode: "Markdown",
        reply_markup: { inline_keyboard: [[{ text: "🗡 Attack", callback_data: "attack" }, { text: "🛡 Shield", callback_data: "shield" }], [{ text: "🏃 Run", callback_data: "run" }]] }
      });
    }
    else if (query.data === "shield") {
      battle.shield = true;
      bot.answerCallbackQuery(query.id, { text: "🛡 Shield Activated!" });
      return;
    }
    else if (query.data === "attack") {
      const playerDamage = Math.floor(Math.random() * 20) + 15;
      battle.demonHp -= playerDamage;

      // WIN CONDITION
      if (battle.demonHp <= 0) {
        let freshPlayers = {};
        try {
          if (fs.existsSync(playerFile)) {
            freshPlayers = JSON.parse(fs.readFileSync(playerFile, "utf8"));
          }
        } catch (err) {
          console.error("🔥 Error reading fresh file:", err);
        }

        if (!freshPlayers[userId]) {
          freshPlayers[userId] = { coins: 0, xp: 0, level: 1, bank: 0, tokens: 0, guildId: null, inventory: [] };
        }

        const rCoins = parseInt(demon.reward) || 50;
        const rXp = parseInt(demon.exp) || 20;

        // Numbers data cleansing
        const currentCoins = Number(freshPlayers[userId].coins || 0);
        const currentXp = Number(freshPlayers[userId].xp || 0);
        let currentLevel = Number(freshPlayers[userId].level || 1);

        // Update balance safely
        freshPlayers[userId].coins = currentCoins + Number(rCoins);
        
        // Accurate level-up algorithm
        let totalXp = currentXp + Number(rXp);
        let xpNeeded = currentLevel * 100;
        let levelUpMessage = "";

        while (totalXp >= xpNeeded) {
          totalXp -= xpNeeded;
          currentLevel += 1;
          xpNeeded = currentLevel * 100;
          levelUpMessage = `\n\n🎉 **LEVEL UP!** Now Level ${currentLevel}!`;
        }

        freshPlayers[userId].level = currentLevel;
        freshPlayers[userId].xp = totalXp < 0 ? 0 : totalXp; 

        try {
          fs.writeFileSync(playerFile, JSON.stringify(freshPlayers, null, 2), "utf8");
          console.log(`✅ Data hard-saved for ${userId}. Coins: ${freshPlayers[userId].coins}, XP: ${freshPlayers[userId].xp}, LVL: ${freshPlayers[userId].level}`);
        } catch (err) {
          console.error("🔥 Error hard-saving file:", err);
        }

        delete battles[userId];

        await bot.editMessageCaption(`🏆 **YOU WON!**\n💰 **+${rCoins} Coins**\n✨ **+${rXp} XP**${levelUpMessage}\n\n✅ Profile synced live with database.`, { 
          chat_id: chatId, 
          message_id: messageId, 
          parse_mode: "Markdown" 
        });
      } 
      else {
        // Counter Attack Logic
        let dDmg = Math.floor(Math.random() * (demon.attack || 15)) + 5;
        if (battle.shield) { dDmg = Math.floor(dDmg / 2); battle.shield = false; }
        battle.playerHp -= dDmg;

        if (battle.playerHp <= 0) {
          delete battles[userId];
          await bot.editMessageCaption(`☠️ **You were defeated by ${demon.name}!**`, { chat_id: chatId, message_id: messageId, parse_mode: "Markdown" });
        } else {
          await bot.editMessageCaption(`🗡 You dealt ${playerDamage} dmg!\n👹 Demon HP: ${battle.demonHp}\n❤️ Your HP: ${battle.playerHp}`, {
            chat_id: chatId, message_id: messageId, parse_mode: "Markdown",
            reply_markup: { inline_keyboard: [[{ text: "🗡 Attack", callback_data: "attack" }, { text: "🛡 Shield", callback_data: "shield" }], [{ text: "🏃 Run", callback_data: "run" }]] }
          });
        }
      }
    }
    bot.answerCallbackQuery(query.id);
  });
};