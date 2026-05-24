console.log("⚔️ BATTLE SYSTEM ONLINE (VELIX OS V2.5) - ENHANCED SECURITY & TIMEOUT MATRIX");

const fs = require("fs");
const path = require("path");
const demons = require("../asset/demons");

const playerFile = path.join(__dirname, "../data/players.json");

const battles = {};

module.exports = (bot) => {
  
  // 🧭 HELPER: Navigation controls
  const getNavigationButtons = (targetUserId) => {
    return [
      [{ text: "👤 Profile", callback_data: `profile_${targetUserId}` }, { text: "🎴 Cards", callback_data: `cards_${targetUserId}` }],
      [{ text: "🏰 Guild", callback_data: `guild_${targetUserId}` }]
    ];
  };

  // ⏱️ HELPER: Auto-Timeout Engine (2 Minutes)
  const startBattleTimer = (userId, chatId, messageId, demonName) => {
    // Agar pehle se koi timer chal raha hai is user ka, toh use clear karo
    if (battles[userId] && battles[userId].timerId) {
      clearTimeout(battles[userId].timerId);
    }

    // 2 Minute (120,000 milliseconds) ka execution alert lagao
    const timerId = setTimeout(async () => {
      if (battles[userId]) {
        delete battles[userId]; // Memory space instantly free

        await bot.editMessageCaption(`⏳ **BATTLE EXPIRED!**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\nSlayer, aapne 2 minute tak koi action nahi liya. **${demonName}** andhere ka fayda uthakar bhag gaya!`, {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: { inline_keyboard: getNavigationButtons(userId) } // Sirf navigation buttons chhodenge
        }).catch(() => {});
      }
    }, 120000);

    return timerId;
  };

  // Dynamic Mission Progression Monitor Engine
  const incrementTaskProgress = async (userId, freshPlayers, msg) => {
    let p = freshPlayers[userId];

    if (p && p.active_task && p.active_task.id === "battle" && !p.active_task.completed) {
      p.active_task.progress += 1;
      
      if (p.active_task.progress >= p.active_task.target) {
        p.active_task.completed = true;
        p.mythic = Number(p.mythic || 0) + 20; 
        p.exp = Number(p.exp || 0) + 50;       
        
        await bot.sendMessage(msg.chat.id, `🎉 **DAILY MISSION COMPLETED!**\n✨ User: *${msg.from.first_name}*\n🎁 Rewards Unlocked: *+20 Mythic Tokens* & *+50 XP*!`, { parse_mode: "Markdown" }).catch(() => {});
      }
    }
  };

  // Command Initialization
  bot.onText(/\/battle/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (battles[userId]) return bot.sendMessage(chatId, "⚠️ You are already in a battle!");

    const demon = demons[Math.floor(Math.random() * demons.length)];
    
    // Initializing structure state
    battles[userId] = { demon, playerHp: 150, demonHp: demon.hp, shield: false, timerId: null };

    const sentMsg = await bot.sendPhoto(chatId, demon.image, {
      caption: `👹 **A Demon Appeared!**\n\n🏷 **Name:** ${demon.name}\n❤️ **HP:** ${demon.hp}\n🗡 **ATK:** ${demon.attack}\n\nWhat will you do? \n\n⏱ _Aapke paas action lene ke liye 2 minute hain!_`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "⚔️ Slay", callback_data: `slay_${userId}` }, { text: "🏃 Run", callback_data: `run_${userId}` }],
          ...getNavigationButtons(userId)
        ]
      }
    });

    // ⏳ Trigger first countdown timer frame
    battles[userId].timerId = startBattleTimer(userId, chatId, sentMsg.message_id, demon.name);
  });

  // Action Button Operations
  bot.on("callback_query", async (query) => {
    if (!query.data.includes("_")) return;
    const [action, targetUserId] = query.data.split("_");
    
    const validBattleActions = ["slay", "run", "attack", "shield"];
    if (!validBattleActions.includes(action)) return;

    const clickerId = query.from.id.toString();

    // 🔥 SECURITY LOCK
    if (clickerId !== targetUserId) {
      return bot.answerCallbackQuery(query.id, { 
        text: "❌ This is not your battle! Type /battle to summon your own demon.", 
        show_alert: true 
      });
    }

    if (!battles[targetUserId]) return bot.answerCallbackQuery(query.id, { text: "❌ No active battle found ya ye session expire ho chuka hai!", show_alert: true });

    const battle = battles[targetUserId];
    const demon = battle.demon;
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;

    if (action === "run") {
      // 🛑 Fight end: Clear runtime timer safely
      if (battle.timerId) clearTimeout(battle.timerId);
      delete battles[targetUserId];
      
      await bot.editMessageCaption(`🏃 You escaped safely from ${demon.name}!`, { 
        chat_id: chatId, 
        message_id: messageId,
        reply_markup: { inline_keyboard: getNavigationButtons(targetUserId) }
      });
    } 
    else if (action === "slay") {
      // ⏳ User active: Reset 2-minute timer for combat turns
      battle.timerId = startBattleTimer(targetUserId, chatId, messageId, demon.name);

      await bot.editMessageCaption(`⚔️ **Battle Started Against ${demon.name}!**\n\n❤️ Your HP: ${battle.playerHp}\n👹 Demon HP: ${battle.demonHp}\n\n⏱ _Turn complete karne ke liye 2 minute hain!_`, {
        chat_id: chatId, message_id: messageId, parse_mode: "Markdown",
        reply_markup: { 
          inline_keyboard: [
            [{ text: "🗡 Attack", callback_data: `attack_${targetUserId}` }, { text: "🛡 Shield", callback_data: `shield_${targetUserId}` }], 
            [{ text: "🏃 Run", callback_data: `run_${targetUserId}` }],
            ...getNavigationButtons(targetUserId)
          ] 
        }
      });
    }
    else {
      let turnLogMessage = "";
      let playerDamage = 0;
      
      if (action === "shield") {
        battle.shield = true;
        bot.answerCallbackQuery(query.id, { text: "🛡 Shield Activated!" });
        turnLogMessage = `🛡 **You raised your defense shield!**\n`;
      }
      
      if (action === "attack") {
        playerDamage = Math.floor(Math.random() * 20) + 15;
        battle.demonHp -= playerDamage;
        turnLogMessage = `🗡 You dealt ${playerDamage} dmg!\n`;

        // WIN CONDITION REACHED
        if (battle.demonHp <= 0) {
          // 🛑 Clear timer instantly on win
          if (battle.timerId) clearTimeout(battle.timerId);

          let freshPlayers = {};
          try {
            if (fs.existsSync(playerFile)) {
              freshPlayers = JSON.parse(fs.readFileSync(playerFile, "utf8"));
            }
          } catch (err) {
            console.error("🔥 Error reading player file database:", err);
          }

          if (!freshPlayers[targetUserId]) {
            freshPlayers[targetUserId] = { coins: 500, bank: 0, crystals: 0, mythic: 0, level: 1, exp: 0, guildId: null, inventory: [], active_task: null };
          }

          const rCoins = parseInt(demon.reward) || 50;
          const rXp = parseInt(demon.exp) || 20;

          const currentCoins = Number(freshPlayers[targetUserId].coins || 0);
          const currentXp = Number(freshPlayers[targetUserId].exp || 0);
          let currentLevel = Number(freshPlayers[targetUserId].level || 1);

          freshPlayers[targetUserId].coins = currentCoins + Number(rCoins);
          
          let totalXp = currentXp + Number(rXp);
          let xpNeeded = currentLevel * 100;
          let levelUpMessage = "";

          while (totalXp >= xpNeeded) {
            totalXp -= xpNeeded;
            currentLevel += 1;
            xpNeeded = currentLevel * 100;
            levelUpMessage = `\n\n🎉 **LEVEL UP!** You have reached **Level ${currentLevel}**!`;
          }

          freshPlayers[targetUserId].level = currentLevel;
          freshPlayers[targetUserId].exp = totalXp < 0 ? 0 : totalXp;

          await incrementTaskProgress(targetUserId, freshPlayers, query.message);

          try {
            fs.writeFileSync(playerFile, JSON.stringify(freshPlayers, null, 2), "utf8");
          } catch (err) {
            console.error("🔥 Error saving file to database storage:", err);
          }

          delete battles[targetUserId];

          return await bot.editMessageCaption(`🏆 **YOU WON!**\n💰 **+${rCoins} Coins**\n✨ **+${rXp} XP**${levelUpMessage}\n\n✅ Profile synced live with database.`, { 
            chat_id: chatId, 
            message_id: messageId, 
            parse_mode: "Markdown",
            reply_markup: { inline_keyboard: getNavigationButtons(targetUserId) }
          });
        }
      }

      // 👹 ENEMY RETALIATION PHASE
      let dDmg = Math.floor(Math.random() * (demon.attack || 15)) + 5;
      if (battle.shield) { 
        dDmg = Math.floor(dDmg / 2); 
        battle.shield = false; 
        turnLogMessage += `👹 ${demon.name} attacks! Your shield blocked half damage, taking \`${dDmg} dmg\`.\n`;
      } else {
        turnLogMessage += `👹 ${demon.name} attacks, dealing \`${dDmg} dmg\`!\n`;
      }
      battle.playerHp -= dDmg;

      // DEFEAT CONDITION REACHED
      if (battle.playerHp <= 0) {
        // 🛑 Clear timer instantly on defeat
        if (battle.timerId) clearTimeout(battle.timerId);
        delete battles[targetUserId];

        await bot.editMessageCaption(`☠️ **You were defeated by ${demon.name}!**`, { 
          chat_id: chatId, 
          message_id: messageId, 
          parse_mode: "Markdown",
          reply_markup: { inline_keyboard: getNavigationButtons(targetUserId) }
        });
      } else {
        // ⏳ Reset 2-minute timer for the next turn loop block
        battle.timerId = startBattleTimer(targetUserId, chatId, messageId, demon.name);

        await bot.editMessageCaption(`${turnLogMessage}\n👹 Demon HP: ${battle.demonHp}\n❤️ Your HP: ${battle.playerHp}\n\n⏱ _Turn complete karne ke liye 2 minute hain!_`, {
          chat_id: chatId, message_id: messageId, parse_mode: "Markdown",
          reply_markup: { 
            inline_keyboard: [
              [{ text: "🗡 Attack", callback_data: `attack_${targetUserId}` }, { text: "🛡 Shield", callback_data: `shield_${targetUserId}` }], 
              [{ text: "🏃 Run", callback_data: `run_${targetUserId}` }],
              ...getNavigationButtons(targetUserId)
            ] 
          }
        });
      }
    }
    bot.answerCallbackQuery(query.id);
  });
};
