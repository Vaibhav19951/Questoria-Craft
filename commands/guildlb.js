console.log("✅ BULLETPROOF GUILD LB LOADED (VELIX OS V2.3)");

const fs = require("fs");
const path = require("path");
const guildFile = path.join(__dirname, "../data/guild.json");

module.exports = (bot) => {
  bot.onText(/\/guildlb/, (msg) => {
    const chatId = msg.chat.id;

    // 1. Safe Load
    let guilds = {};
    try {
      if (fs.existsSync(guildFile)) {
        const raw = fs.readFileSync(guildFile, "utf8");
        guilds = JSON.parse(raw);
      }
    } catch (e) {
      console.error("GuildDB Read Error:", e);
      return bot.sendMessage(chatId, "❌ Database error: Guild data unreadable.");
    }

    // 2. Safe Filter & Sort
    const guildArray = Object.keys(guilds)
      .map(id => ({ id, ...guilds[id] }))
      .filter(g => g.name); // Sirf wahi guilds uthao jinme name hai

    if (guildArray.length === 0) {
      return bot.sendMessage(chatId, "❌ No active guilds found.");
    }

    guildArray.sort((a, b) => (b.glory || 0) - (a.glory || 0));
    const top = guildArray.slice(0, 10);

    // 3. Building Message
    let text = "🏆 **GUILD GLORY LEADERBOARD** 🏆\n────────────────────\n";
    
    top.forEach((g, i) => {
      const rank = ["🥇", "🥈", "🥉"][i] || `${i + 1}.`;
      const members = (g.members && Array.isArray(g.members)) ? g.members.length : 0;
      text += `${rank} **${g.name}**\n   └ 🏆 Glory: \`${(g.glory || 0).toLocaleString()}\` | 👥 Members: \`${members}\`\n\n`;
    });

    // 4. Final Send
    bot.sendMessage(chatId, text, { parse_mode: "Markdown" }).catch(err => {
      console.error("LB Send Error:", err);
    });
  });
};