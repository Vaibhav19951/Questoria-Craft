console.log("⚔️ INTERACTIVE PROFILE SYSTEM (IMAGE URL COMPULSORY)");

const fs = require("fs");
const path = require("path");
const dataDir = path.join(process.cwd(), "data");
const playerFile = path.join(dataDir, "players.json");
const guildFile = path.join(dataDir, "guild.json");

// Main Photo URL (Compulsory)
const PROFILE_PHOTO = "https://i.pinimg.com/736x/52/f5/97/52f597b5ed03c1f59f54aa656be46c7d.jpg";

const safeReadJSON = (filePath) => {
  try { if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (e) {}
  return {};
};

module.exports = (bot) => {
  // Command: /profile (Image ke saath)
  bot.onText(/\/profile/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const players = safeReadJSON(playerFile);
    const guilds = safeReadJSON(guildFile);
    const stats = players[userId] || { coins: 0, bank: 0, level: 1, xp: 0, guildId: null, inventory: [] };
    const userGuild = stats.guildId && guilds[stats.guildId] ? guilds[stats.guildId].name : "No Guild Joined";

    const mainCaption = `⚔️ **SLAYER MAIN PROFILE**\n━━━━━━━━━━━━━━━━━━━━━━━━\n👤 **NAME:** \`${msg.from.first_name.toUpperCase()}\`\n🏰 **GUILD:** \`${userGuild}\`\n💰 **WALLET:** \`${(stats.coins || 0).toLocaleString()} 🪙\`\n🏦 **BANK:** \`${(stats.bank || 0).toLocaleString()} 🏦\`\n📈 **RANK:** \`Lvl ${stats.level || 1}\`\n🧪 **XP:** \`${stats.xp || 0} XP\``;

    await bot.sendPhoto(chatId, PROFILE_PHOTO, {
      caption: mainCaption, 
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [[{ text: "🎒 Inventory", callback_data: `inv_${userId}` }, { text: "👑 Cards", callback_data: `char_${userId}` }], [{ text: "🏰 Guild", callback_data: `gld_${userId}` }, { text: "🔄 Main", callback_data: `main_${userId}` }]] }
    });
  });

  // Buttons Logic (Sirf Caption edit hoga, photo nahi)
  bot.on("callback_query", async (query) => {
    if (!query.data.includes("_")) return;
    const [action, targetUserId] = query.data.split("_");
    if (query.from.id.toString() !== targetUserId) return bot.answerCallbackQuery(query.id, { text: "❌ Not your profile!", show_alert: true });

    const players = safeReadJSON(playerFile);
    const stats = players[targetUserId] || { coins: 0, bank: 0, level: 1, xp: 0, guildId: null, inventory: [] };
    let updatedCaption = "";

    if (action === "main") {
      updatedCaption = `⚔️ **SLAYER MAIN PROFILE**\n━━━━━━━━━━━━━━━━━━━━━━━━\n👤 **NAME:** \`${query.from.first_name.toUpperCase()}\`\n💰 **WALLET:** \`${(stats.coins || 0).toLocaleString()} 🪙\`\n🏦 **BANK:** \`${(stats.bank || 0).toLocaleString()} 🏦\`\n📈 **RANK:** \`Lvl ${stats.level || 1}\`\n🧪 **XP:** \`${stats.xp || 0} XP\``;
    } 
    else if (action === "inv") {
      updatedCaption = `🎒 **INVENTORY**\n━━━━━━━━━━━━━━━━━━━━━━━━\n` + (stats.inventory.length > 0 ? stats.inventory.join("\n") : "Your bag is empty!");
    }
    else if (action === "char") {
      updatedCaption = `👑 **COLLECTED CARDS**\n━━━━━━━━━━━━━━━━━━━━━━━━\nTotal Cards: \`${stats.inventory.length}\`\n\n_Keep grinding to unlock more!_`;
    }
    else if (action === "gld") {
      updatedCaption = `🏰 **GUILD INFO**\n━━━━━━━━━━━━━━━━━━━━━━━━\nGuild ID: \`${stats.guildId || "None"}\`\n\n_Join a guild to participate in wars!_`;
    }

    await bot.editMessageCaption(updatedCaption, { 
      chat_id: query.message.chat.id, 
      message_id: query.message.message_id, 
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [[{ text: "🎒 Inventory", callback_data: `inv_${targetUserId}` }, { text: "👑 Cards", callback_data: `char_${targetUserId}` }], [{ text: "🏰 Guild", callback_data: `gld_${targetUserId}` }, { text: "🔄 Main", callback_data: `main_${targetUserId}` }]] }
    });
    bot.answerCallbackQuery(query.id);
  });
};