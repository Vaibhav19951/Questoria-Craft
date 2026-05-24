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
├ 🔺 **Level:** \`${stats.level || 1}\`
└ 🧪 **EXP:** \`${stats.exp || 0} XP\`

💰 **ASSET WALLET:**
├ 🪙 **Coins:** \`${(stats.coins || 0).toLocaleString()}\`
├ 🏦 **Bank:** \`${(stats.bank || 0).toLocaleString()}\`
├ 💎 **Crystals:** \`${(stats.crystals || 0).toLocaleString()}\`
└ ✨ **Mythic Tokens:** \`${(stats.mythic || 0).toLocaleString()}\`

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
    
    const stats = players[userId] || { coins: 500, bank: 0, crystals: 0, mythic: 0, level: 1, exp: 0, guildId: null, inventory: [], active_task: null };
    const userGuild = stats.guildId && guilds[stats.guildId] ? guilds[stats.guildId].name : "No Guild Joined";

    const mainCaption = buildMainCaption(msg.from.first_name, stats, userGuild);

    await bot.sendPhoto(chatId, PROFILE_PHOTO, {
      caption: mainCaption, 
      parse_mode: "Markdown",
      reply_markup: { 
        inline_keyboard: [
          [{ text: "🎒 Inventory", callback_data: `inv_${userId}` }, { text: "👑 Cards", callback_data: `char_${userId}` }], 
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
    const stats = players[targetUserId] || { coins: 500, bank: 0, crystals: 0, mythic: 0, level: 1, exp: 0, guildId: null, inventory: [], active_task: null };
    const userGuild = stats.guildId && guilds[stats.guildId] ? guilds[stats.guildId].name : "No Guild Joined";
    let updatedCaption = "";

    if (action === "main") {
      updatedCaption = buildMainCaption(query.from.first_name, stats, userGuild);
    } 
    else if (action === "inv") {
      updatedCaption = `🎒 **INVENTORY BAG**\n━━━━━━━━━━━━━━━━━━━━━━━━\n` + 
                       (stats.inventory && stats.inventory.length > 0 ? stats.inventory.map(item => `• ${item}`).join("\n") : "_Your inventory bag is completely empty!_");
    }
    else if (action === "char") {
      const totalCards = stats.inventory ? stats.inventory.length : 0;
      updatedCaption = `👑 **CHARACTER COLLECTION**\n━━━━━━━━━━━━━━━━━━━━━━━━\nTotal Cards Unlocked: \`${totalCards}\`\n\n_Use /spin or /summon to unlock rare character drops!_`;
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
            [{ text: "🎒 Inventory", callback_data: `inv_${targetUserId}` }, { text: "👑 Cards", callback_data: `char_${targetUserId}` }], 
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
