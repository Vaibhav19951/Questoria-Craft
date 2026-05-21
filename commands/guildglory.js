console.log("✅ GUILD GLORY FILE LOADED");

const fs = require("fs");
const path = require("path");

const playerFile = path.join(__dirname, "../data/players.json");
const guildFile = path.join(__dirname, "../data/guilds.json");

// LOAD DATA SAFELY
let players = {};
let guilds = {};

try { players = JSON.parse(fs.readFileSync(playerFile, "utf8")); } catch { players = {}; }
try { guilds = JSON.parse(fs.readFileSync(guildFile, "utf8")); } catch { guilds = {}; }

// SAVE DATA SAFELY
const savePlayers = () => fs.writeFileSync(playerFile, JSON.stringify(players, null, 2));
const saveGuilds = () => fs.writeFileSync(guildFile, JSON.stringify(guilds, null, 2));

module.exports = (bot) => {

  // =========================
  // GUILD REWARDS PANEL
  // =========================
  bot.onText(/\/guildrewards/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendPhoto(
      chatId,
      "https://pic-link-bot.lovable.app/i/telegram-1779356514904-618f311d.jpg",
      {
        caption: 
`🏆 GUILD GLORY SYSTEM

⚔️ HOW IT WORKS
• Glory is earned automatically through battles & activities.
• Every member has their own personal contribution.
• Weekly rewards are distributed based on YOUR contribution only.

📅 WEEKLY RESET:
Every Monday
━━━━━━━━━━━━━━━
🎁 REWARDS

🏆 2000 Glory -> 💰 50000 Coins
🏆 4000 Glory -> 💰 100000 Coins
🏆 6000 Glory -> 🧬 100 Mythical Crystals
🏆 8000 Glory -> 🏅 20 Guild Tokens
━━━━━━━━━━━━━━━
🔥 USE /claimguildrewards TO CLAIM YOUR MILESTONES!

⚔️ DEMON SLAYER BOT ⚔️`
      }
    );
  });

  // =========================
  // CLAIM GUILD REWARDS COMMAND (NEW)
  // =========================
  bot.onText(/\/claimguildrewards/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    // Ensure player profile exists
    if (!players[userId]) {
      return bot.sendMessage(chatId, "❌ You don't have a profile yet! Type /balance to make one.");
    }

    const player = players[userId];

    // Find their guild
    let userGuild = null;
    for (const id in guilds) {
      if (guilds[id] && Array.isArray(guilds[id].members) && guilds[id].members.includes(userId)) {
        userGuild = guilds[id];
        break;
      }
    }

    if (!userGuild) {
      return bot.sendMessage(chatId, "❌ You must be in a guild to claim glory rewards!");
    }

    const currentGlory = userGuild.glory || 0;
    
    // Ensure reward tracking exists for this specific guild setup
    if (!userGuild.rewardClaimed) {
      userGuild.rewardClaimed = { 2000: false, 4000: false, 6000: false, 8000: false };
    }

    let claimedText = "";
    let updatedSomething = false;

    // Check Milestone 1: 2000 Glory
    if (currentGlory >= 2000 && !userGuild.rewardClaimed[2000]) {
      player.coins += 50000;
      userGuild.rewardClaimed[2000] = true;
      claimedText += "🎁 Unlocked Tier 1: Received **50,000 Coins**!\n";
      updatedSomething = true;
    }

    // Check Milestone 2: 4000 Glory
    if (currentGlory >= 4000 && !userGuild.rewardClaimed[4000]) {
      player.coins += 100000;
      userGuild.rewardClaimed[4000] = true;
      claimedText += "🎁 Unlocked Tier 2: Received **100,000 Coins**!\n";
      updatedSomething = true;
    }

    // Check Milestone 3: 6000 Glory
    if (currentGlory >= 6000 && !userGuild.rewardClaimed[6000]) {
      player.mythicalCrystals = (player.mythicalCrystals || 0) + 100;
      userGuild.rewardClaimed[6000] = true;
      claimedText += "🎁 Unlocked Tier 3: Received **100 Mythical Crystals**!\n";
      updatedSomething = true;
    }

    // Check Milestone 4: 8000 Glory
    if (currentGlory >= 8000 && !userGuild.rewardClaimed[8000]) {
      userGuild.guildTokens = (userGuild.guildTokens || 0) + 20;
      userGuild.rewardClaimed[8000] = true;
      claimedText += "🎁 Unlocked Tier 4: Your Guild received **20 Guild Tokens**!\n";
      updatedSomething = true;
    }

    if (!updatedSomething) {
      return bot.sendMessage(
        chatId, 
        `ℹ️ No new rewards available to claim.\n🏰 **Current Guild Glory:** ${currentGlory}\n\nKeep playing to reach the next milestone tier!`
      );
    }

    // Save changes to files
    savePlayers();
    saveGuilds();

    bot.sendMessage(
      chatId,
      `🎉 **Rewards Claimed Successfully!**\n\n${claimedText}\nYour updated status has been saved!`,
      { parse_mode: "Markdown" }
    );
  });

};
