console.log("⚔️ VELIX OS V2.5 | STRICT SECURITY PROFILE HUB [ENGLISH VERSION]");

const fs = require("fs");
const path = require("path");
const dataDir = path.join(process.cwd(), "data");
const playerFile = path.join(dataDir, "players.json");
const guildFile = path.join(dataDir, "guild.json");

const PROFILE_PHOTO = "https://i.pinimg.com/736x/52/f5/97/52f597b5ed03c1f59f54aa656be46c7d.jpg";

const safeReadJSON = (filePath) => {
  try { if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (e) {}
  return {};
};

// Sanitization Shield inside interface router to avoid rendering NaN
const sanitizeStats = (stats) => {
  let s = stats || {};
  return {
    coins: Math.max(0, parseInt(s.coins) || 0),
    bank: Math.max(0, parseInt(s.bank) || 0),
    crystals: Math.max(0, parseInt(s.crystals) || 0),
    mythic: Math.max(0, parseInt(s.mythic) || 0),
    level: Math.max(1, parseInt(s.level) || 1),
    exp: Math.max(0, parseInt(s.exp) || 0),
    guildId: s.guildId || null,
    inventory: Array.isArray(s.inventory) ? s.inventory : [],
    materials: s.materials && typeof s.materials === 'object' ? s.materials : {},
    active_task: s.active_task || null
  };
};

// Helper function to build Main Dashboard Layout
const buildMainCaption = (username, stats, userGuild) => {
  let taskText = "_No active mission. Type /task to assign one!_";
  if (stats.active_task) {
    const t = stats.active_task;
    const statusIcon = t.completed ? "✅" : "⏳";
    taskText = `\n📜 **Mission:** ${t.desc}\n📊 **Progress:** [${t.progress}/${t.target}] ${statusIcon}`;
  }

  return `⚔️ **SLAYER PRO-HUB PROFILE**
━━━━━━━━━━━━━━━━━━━━━━━━
👤 **NAME:** \`${username.toUpperCase()}\`
🏰 **GUILD:** \`${userGuild}\`

📈 **RANK STATUS:**
├ 🔺 **Level:** \`${stats.level}\`
└ 🧪 **EXP:** \`${stats.exp} XP\`

💰 **ASSET WALLET:**
├ 🪙 **Coins:** \`${stats.coins.toLocaleString()}\`
├ 🏦 **Bank:** \`${stats.bank.toLocaleString()}\`
├ 💎 **Crystals:** \`${stats.crystals.toLocaleString()}\`
└ ✨ **Mythic Tokens:** \`${stats.mythic.toLocaleString()}\`

📋 **DAILY MISSION STATUS:**${taskText}
━━━━━━━━━━━━━━━━━━━━━━━━`;
};

module.exports = (bot) => {
  
  // Command: /profile
  bot.onText(/\/profile/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString(); // Profile Owner ID
    const players = safeReadJSON(playerFile);
    const guilds = safeReadJSON(guildFile);
    
    const stats = sanitizeStats(players[userId]);
    const userGuild = stats.guildId && guilds[stats.guildId] ? guilds[stats.guildId].name : "No Guild Joined";

    const mainCaption = buildMainCaption(msg.from.first_name, stats, userGuild);

    await bot.sendPhoto(chatId, PROFILE_PHOTO, {
      caption: mainCaption, 
      parse_mode: "Markdown",
      reply_markup: { 
        inline_keyboard: [
          [{ text: "🎒 Inventory Bag", callback_data: `inv_${userId}` }, { text: "👑 Card Roster", callback_data: `char_${userId}` }], 
          [{ text: "🏰 Guild", callback_data: `gld_${userId}` }, { text: "🔄 Refresh Hub", callback_data: `main_${userId}` }]
        ] 
      }
    });
  });

  // Inline Button Click Handler with Strict Security Lock
  bot.on("callback_query", async (query) => {
    if (!query.data.includes("_")) return;
    
    const [action, targetUserId] = query.data.split("_");
    const clickerId = query.from.id.toString(); // ID of the user clicking the button

    // 🔥 SECURITY LOCK: If someone else tries to tap the interface buttons
    if (clickerId !== targetUserId) {
      return bot.answerCallbackQuery(query.id, { 
        text: "❌ This is not your personal dashboard! Type /profile in chat to view your own assets.", 
        show_alert: true // Shows a strict native error pop-up
      });
    }

    const players = safeReadJSON(playerFile);
    const guilds = safeReadJSON(guildFile);
    const stats = sanitizeStats(players[targetUserId]);
    const userGuild = stats.guildId && guilds[stats.guildId] ? guilds[stats.guildId].name : "No Guild Joined";
    let updatedCaption = "";

    if (action === "main") {
      updatedCaption = buildMainCaption(query.from.first_name, stats, userGuild);
    } 
    else if (action === "inv") {
      // 🎒 BAG: Shows raw crafting materials and essence balances
      let essenceEntries = Object.entries(stats.materials).filter(([_, count]) => (parseInt(count) || 0) > 0);
      let materialText = "";

      if (essenceEntries.length === 0) {
        materialText = "_Your item bags are completely empty! Pull duplicates to gather components._";
      } else {
        materialText = essenceEntries.map(([key, value]) => `• 🧪 **${key.replace('_', ' ').toUpperCase()}:** \`${value}\` pcs`).join("\n");
      }

      updatedCaption = `🎒 **STORAGE BAG (MATERIALS)**\n━━━━━━━━━━━━━━━━━━━━━━━━\n${materialText}\n━━━━━━━━━━━━━━━━━━━━━━━━\n💡 *Use these character essences to unleash rank ascension updates via /upgrade.*`;
    }
    else if (action === "char") {
      // 👑 ROSTER: Compiles dynamic warrior levels, power configurations and stars
      let characterText = "";

      if (stats.inventory.length === 0) {
        characterText = "_No slayers recruited yet! Use /spin to extract rare warrior units._";
      } else {
        characterText = stats.inventory.map((item, idx) => {
          let cName = typeof item === "string" ? item : (item.name || "Unknown Slayer");
          let cLevel = typeof item === "string" ? 1 : (parseInt(item.level) || 1);
          let levelStars = "⭐".repeat(cLevel);
          let powerMetric = cLevel * 150;

          return `\`${idx + 1}.\` 👤 **${cName}**\n     ┗ 💠 [Lv. ${cLevel}] ${levelStars} | ⚡ \`${powerMetric} CP\``;
        }).join("\n\n");
      }

      updatedCaption = `👑 **WARRIOR SQUAD ROSTER**\n━━━━━━━━━━━━━━━━━━━━━━━━\n${characterText}\n━━━━━━━━━━━━━━━━━━━━━━━━\n💡 *To ascend any character rank: Type \`/upgrade <name>\` in chat.*`;
    }
    else if (action === "gld") {
      updatedCaption = `🏰 **GUILD HUB INFO**\n━━━━━━━━━━━━━━━━━━━━━━━━\n🔹 **Current Guild:** \`${userGuild}\`\n🔹 **Guild Faction ID:** \`${stats.guildId || "None"}\`\n\n_Cooperate with your guild members to unlock massive vault upgrades!_`;
    }

    try {
      await bot.editMessageCaption(updatedCaption, { 
        chat_id: query.message.chat.id, 
        message_id: query.message.message_id, 
        parse_mode: "Markdown",
        reply_markup: { 
          inline_keyboard: [
            [{ text: "🎒 Inventory Bag", callback_data: `inv_${targetUserId}` }, { text: "👑 Card Roster", callback_data: `char_${targetUserId}` }], 
            [{ text: "🏰 Guild", callback_data: `gld_${targetUserId}` }, { text: "🔄 Main Hub", callback_data: `main_${targetUserId}` }]
          ] 
        }
      });
    } catch (err) {
      console.log("Error editing caption layout.");
    }
    
    bot.answerCallbackQuery(query.id);
  });
};
