console.log("✅ GUILD LEADERBOARD FILE LOADED");

const fs = require("fs");
const path = require("path");

const guildFile = path.join(__dirname, "../data/guild.json");

module.exports = (bot) => {

  // =========================
  // GUILD LEADERBOARD COMMAND
  // =========================
  bot.onText(/\/guildlb/, (msg) => {
    const chatId = msg.chat.id;

    // Load the guild database live every time the command is used
    let guilds = {};
    try { 
      guilds = JSON.parse(fs.readFileSync(guildFile, "utf8")); 
    } catch (err) { 
      guilds = {}; 
    }

    // Convert guilds object to an array and sort them by vault coins
    const guildArray = Object.values(guilds)
      .filter(g => g && g.name)
      .sort((a, b) => (b.vault?.coins || 0) - (a.vault?.coins || 0));

    if (guildArray.length === 0) {
      return bot.sendMessage(chatId, "❌ No guilds have been created yet on this server.");
    }

    let text = "🏆 **GUILD LEADERBOARD (VAULT COINS)** 🏆\n\n";

    // Grab the top 10 guilds
    guildArray.slice(0, 10).forEach((guild, index) => {
      let medal = `${index + 1}.`;
      if (index === 0) medal = "🥇";
      if (index === 1) medal = "🥈";
      if (index === 2) medal = "🥉";

      text += `${medal} **${guild.name}**\n👥 Members: ${guild.members.length}/${guild.maxMembers}\n🏦 Vault balance: ${guild.vault?.coins || 0} coins\n\n`;
    });

    bot.sendAnimation(
      chatId,
      "https://i.pinimg.com/originals/b1/76/95/b176956f18223739da05d785927e02ca.gif",
      {
        caption: text,
        parse_mode: "Markdown"
      }
    );
  });

};
