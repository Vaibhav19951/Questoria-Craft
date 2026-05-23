console.log("⚔️ GUILD GLORY SYSTEM v2.3 FINAL LOADED");

const fs = require("fs");
const path = require("path");

const playerFile = path.join(__dirname, "../data/players.json");
const guildFile = path.join(__dirname, "../data/guild.json");

// DATA LOADERS
const loadDB = (file) => {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return {}; }
};

const saveDB = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
};

module.exports = (bot) => {

  // 1. REWARDS PANEL
  bot.onText(/\/guildrewards/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendPhoto(chatId, "https://pic-link-bot.lovable.app/i/telegram-1779356514904-618f311d.jpg", {
      caption: `🏆 **GUILD GLORY SYSTEM**\n\n🎁 **MILESTONE REWARDS**\n🏆 2000 Glory -> 💰 50,000 Coins\n🏆 4000 Glory -> 💰 100,000 Coins\n🏆 6000 Glory -> 🎴 100 Slayer Tokens\n🏆 8000 Glory -> 🏅 20 Guild Tokens\n\n🔥 Use /claimguildrewards to claim!`,
      parse_mode: "Markdown"
    });
  });

  // 2. CLAIM REWARDS (FIXED LOGIC)
  bot.onText(/\/claimguildrewards/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    let players = loadDB(playerFile);
    let guilds = loadDB(guildFile);

    if (!players[userId]) return bot.sendMessage(chatId, "❌ Register with /profile first!");

    const player = players[userId];
    let userGuild = null;
    let userGuildKey = null;

    // Check if player has guildId in profile OR loop through guilds to find them
    if (player.guildId && guilds[player.guildId]) {
      userGuild = guilds[player.guildId];
      userGuildKey = player.guildId;
    } else {
      for (const id in guilds) {
        if (guilds[id].members && guilds[id].members.includes(userId)) {
          userGuild = guilds[id];
          userGuildKey = id;
          player.guildId = id; // Syncing the profile automatically
          break;
        }
      }
    }

    if (!userGuild) return bot.sendMessage(chatId, "❌ You must be in a guild to claim glory rewards!");

    const currentGlory = userGuild.glory || 0;
    if (!player.claimedGuildMilestones) player.claimedGuildMilestones = { 2000: false, 4000: false, 6000: false, 8000: false };

    let claimedText = "";
    let updated = false;

    if (currentGlory >= 2000 && !player.claimedGuildMilestones[2000]) {
      player.coins = (player.coins || 0) + 50000;
      player.claimedGuildMilestones[2000] = true;
      claimedText += "✅ 2000 Glory: 50,000 Coins\n";
      updated = true;
    }
    if (currentGlory >= 4000 && !player.claimedGuildMilestones[4000]) {
      player.coins = (player.coins || 0) + 100000;
      player.claimedGuildMilestones[4000] = true;
      claimedText += "✅ 4000 Glory: 100,000 Coins\n";
      updated = true;
    }
    if (currentGlory >= 6000 && !player.claimedGuildMilestones[6000]) {
      player.tokens = (player.tokens || 0) + 100;
      player.claimedGuildMilestones[6000] = true;
      claimedText += "✅ 6000 Glory: 100 Slayer Tokens\n";
      updated = true;
    }
    if (currentGlory >= 8000 && !player.claimedGuildMilestones[8000]) {
      userGuild.guildTokens = (userGuild.guildTokens || 0) + 20;
      player.claimedGuildMilestones[8000] = true;
      claimedText += "✅ 8000 Glory: 20 Guild Tokens (Vault)\n";
      updated = true;
    }

    if (!updated) {
      return bot.sendMessage(chatId, `ℹ️ No new rewards. Current Glory: \`${currentGlory}\``);
    }

    saveDB(playerFile, players);
    saveDB(guildFile, guilds);
    bot.sendMessage(chatId, `🎉 **Rewards Claimed!**\n\n${claimedText}`);
  });

  // 3. ADMIN: ADD GLORY (GLOBAL SYNC)
  bot.onText(/\/addglory (.+) (\d+)/, (msg, match) => {
    const guildName = match[1].trim();
    const amount = parseInt(match[2]);
    let guilds = loadDB(guildFile);
    
    let found = false;
    for (const id in guilds) {
        if (guilds[id].name.toLowerCase() === guildName.toLowerCase()) {
            guilds[id].glory = (guilds[id].glory || 0) + amount;
            found = true;
            break;
        }
    }
    
    if (found) {
        saveDB(guildFile, guilds);
        bot.sendMessage(msg.chat.id, `✅ Added ${amount} glory to ${guildName}!`);
    } else {
        bot.sendMessage(msg.chat.id, "❌ Guild not found.");
    }
  });
};