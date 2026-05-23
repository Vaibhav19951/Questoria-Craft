console.log("✅ TERMINAL-FREE NATIVE PROFILE SYSTEM LOADED");

const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../data");
const playerFile = path.join(dataDir, "players.json");
const guildFile = path.join(dataDir, "guild.json");

let players = {};
let guilds = {};

try { players = JSON.parse(fs.readFileSync(playerFile, "utf8")); } catch { players = {}; }
try { guilds = JSON.parse(fs.readFileSync(guildFile, "utf8")); } catch { guilds = {}; }

module.exports = (bot) => {
  
  const getPlayerStats = (userId) => {
    if (!players[userId]) {
      players[userId] = { coins: 1000, tokens: 0, level: 1, xp: 0, guildId: null, characters: [] };
    }
    return players[userId];
  };

  // ==========================================
  // 👤 ZERO-DEPENDENCY PROFILE (/profile)
  // ==========================================
  bot.onText(/\/profile/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const username = msg.from.first_name || "Demon Slayer";
    
    const stats = getPlayerStats(userId);
    const userGuild = stats.guildId && guilds[stats.guildId] ? guilds[stats.guildId].name : "No Guild Joined";
    const totalCards = stats.characters ? stats.characters.length : 0;

    // Tumhari di hui permanent Pinterest background link
    const permanentBackground = "https://i.pinimg.com/736x/9b/35/e8/9b35e852f18742bc03131e623615ff94.jpg";

    // Ekdum rigid, clean aur professional text layout structure
    const profileCaption = `╔════════════════════════╗\n` +
                           `   👤  *SLAYER CORPS IDENTITY CARD*   \n` +
                           `╚════════════════════════╝\n\n` +
                           `📋 *NAME :*  ${username}\n` +
                           `🆔 *USER ID :*  \`${userId}\`\n` +
                           `⚔️ *RANK LEVEL :*  \`Lvl ${stats.level}\`\n` +
                           `✨ *EXPERIENCE :*  \`${stats.xp} XP\`\n` +
                           `🏰 *GUILD SYSTEM :*  *${userGuild}*\n` +
                           `💰 *SLAYER COINS :*  \`💰 ${stats.coins}\`\n` +
                           `👑 *TOTAL CARDS :*  \`${totalCards} Cards\`\n\n` +
                           `🛸 _Database node parameters synchronized successfully._`;

    try {
      // User ki live Telegram PFP fetch karne ka try karte hain
      const profilePhotos = await bot.getUserProfilePhotos(userId, { limit: 1 });
      
      if (profilePhotos && profilePhotos.total_count > 0) {
        const fileId = profilePhotos.photos[0][0].file_id;
        
        // Pehle User ki apni DP bhejega mast structured stats ke sath
        await bot.sendPhoto(chatId, fileId, {
          caption: profileCaption,
          parse_mode: "Markdown"
        });
      } else {
        // Agar user ki koi PFP nahi hai, toh direct tumhara background image default set ho jayega
        await bot.sendPhoto(chatId, permanentBackground, {
          caption: profileCaption,
          parse_mode: "Markdown"
        });
      }
    } catch (err) {
      console.error("Profile dispatch execution fault:", err.message);
      // Kuch bhi crash hone par permanent background default image fallback layer par trigger ho jayega
      await bot.sendPhoto(chatId, permanentBackground, {
        caption: profileCaption,
        parse_mode: "Markdown"
      });
    }
  });
};
