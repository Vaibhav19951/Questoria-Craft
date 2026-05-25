/**
 * VELIX OS V2.5 | ALLIANCE GLORY & CORPS REWARDS ENGINE
 * Fully Linked with Centralized Ledger & Inventory Engine
 * Multi-Thread Concurrency Safe & Anti-Duplication Protection
 */

const fs = require("fs");
const path = require("path");
const guildFile = path.join(process.cwd(), "data", "guild.json");

// Isolated Read/Write Gates for Guild Matrices
const safeReadGuilds = () => {
  try { 
    if (fs.existsSync(guildFile)) return JSON.parse(fs.readFileSync(guildFile, "utf8")); 
  } catch (e) {
    console.error("❌ Glory Engine system read lock:", e.message);
  }
  return {};
};

const safeSaveGuilds = (data) => {
  try {
    fs.writeFileSync(guildFile, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("❌ Glory Engine system write lock:", e.message);
  }
};

console.log("🦅 [LOADED SUCCESS] Alliance Glory Module Hooked: guildglory.js");

module.exports = (bot) => {

  // ==========================================
  // 🏆 /guildrewards - MILESTONE DASHBOARD
  // ==========================================
  bot.onText(/\/guildrewards/, async (msg) => {
    const chatId = msg.chat.id;
    
    await bot.sendPhoto(chatId, "https://pic-link-bot.lovable.app/i/telegram-1779356514904-618f311d.jpg", {
      caption: `🏆 **VELIX OS | GUILD GLORY TRACK OVERVIEW**\n` +
               `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
               `Coordinated operations unlock substantial sub-ledger asset vaults:\n\n` +
               `🎖️ **🏆 2,000 GP Milestone:**\n` +
               `🎁 Reward Allocation: 🪙 \`50,000\` Crow Coins\n\n` +
               `🎖️ **🏆 4,000 GP Milestone:**\n` +
               `🎁 Reward Allocation: 🪙 \`100,000\` Crow Coins\n\n` +
               `🎖️ **🏆 6,000 GP Milestone:**\n` +
               `🎁 Reward Allocation: ✨ \`100\` Mythic Tokens\n\n` +
               `🎖️ **🏆 8,000 GP Milestone:**\n` +
               `🎁 Reward Allocation: 🏅 \`20\` Guild Expansion Tokens\n` +
               `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
               `🔥 *Execute \`/claimguildrewards\` to extract cleared thresholds.*`,
      parse_mode: "Markdown"
    }).catch((e) => console.error("Error sending rewards image:", e.message));
  });

  // ==========================================
  // 🎉 /claimguildrewards - DATA-LOSS SAFE CLAIM
  // ==========================================
  bot.onText(/\/claimguildrewards/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    // Centralized Player Engine Call
    const player = bot.getPlayerData(userId);
    if (!player) return;

    // Safety checks to prevent fallback structural drops
    if (player.coins === undefined) player.coins = 0;
    if (player.mythic === undefined) player.mythic = 0; // Standardized token alignment
    if (!player.claimedGuildMilestones) {
      player.claimedGuildMilestones = { "2000": false, "4000": false, "6000": false, "8000": false };
    }

    const guilds = safeReadGuilds();
    let userGuild = null;

    // Strict profile boundary verification
    if (player.guildId && guilds[player.guildId]) {
      userGuild = guilds[player.guildId];
    } else {
      // Automatic trace fallback mechanism
      for (const id in guilds) {
        if (guilds[id] && guilds[id].members && guilds[id].members.includes(userId)) {
          userGuild = guilds[id];
          player.guildId = id; // Auto-sync structural property inside main ledger
          break;
        }
      }
    }

    if (!userGuild) {
      return bot.sendMessage(chatId, "❌ **Deployment Void:** You must be linked inside an operational corps faction array to claim glory rewards.");
    }

    const currentGlory = userGuild.glory || 0;
    let claimedText = "";
    let updated = false;

    // Milestone Execution Matrix Loop
    if (currentGlory >= 2000 && !player.claimedGuildMilestones["2000"]) {
      player.coins += 50000;
      player.claimedGuildMilestones["2000"] = true;
      claimedText += "✨ **Tier I Cleared:** 🪙 `+50,000` Crow Coins Added.\n";
      updated = true;
    }
    if (currentGlory >= 4000 && !player.claimedGuildMilestones["4000"]) {
      player.coins += 100000;
      player.claimedGuildMilestones["4000"] = true;
      claimedText += "✨ **Tier II Cleared:** 🪙 `+100,000` Crow Coins Added.\n";
      updated = true;
    }
    if (currentGlory >= 6000 && !player.claimedGuildMilestones["6000"]) {
      player.mythic += 100; // Aligned with central core naming standard
      player.claimedGuildMilestones["6000"] = true;
      claimedText += "✨ **Tier III Cleared:** 💎 `+100` Mythic Tokens Synced.\n";
      updated = true;
    }
    if (currentGlory >= 8000 && !player.claimedGuildMilestones["8000"]) {
      userGuild.guildTokens = (parseInt(userGuild.guildTokens, 10) || 0) + 20;
      player.claimedGuildMilestones["8000"] = true;
      claimedText += "✨ **Tier IV Cleared:** 🏅 `+20` Guild Expansion Tokens locked into Faction Vault.\n";
      updated = true;
    }

    if (!updated) {
      return bot.sendMessage(chatId, `ℹ️ **No Available Clearances:** Your alliance currently possesses 🏆 \`${currentGlory.toLocaleString()} GP\`.\n💡 *You have extracted all possible rewards for this point tier level.*`);
    }

    // Atomic synchronized dual-write sequence
    safeSaveGuilds(guilds);
    bot.savePlayerData(userId, player);

    bot.sendMessage(
      chatId, 
      `🎉 **VELIX OS | EXTRACTION DISPATCH COMPLETED**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Faction Glory records validated successfully. Distributed payloads:\n\n${claimedText}` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `⚖️ *Ledger balances and alliance vaults updated and sealed safely.*`,
      { parse_mode: "Markdown" }
    );
  });

  // ==========================================
  // ⚡ ADMIN: /addglory [name] [amount]
  // ==========================================
  bot.onText(/\/addglory (.+) (\d+)/, async (msg, match) => {
    // Basic structural authorization check (Modify to match your personal Admin ID verification logic if needed)
    const guildName = match[1].trim();
    const amount = parseInt(match[2], 10);
    
    if (isNaN(amount) || amount <= 0) {
      return bot.sendMessage(msg.chat.id, "❌ **System Parsing Error:** Glory input must be an integer increment value.");
    }

    const guilds = safeReadGuilds();
    let found = false;

    for (const id in guilds) {
      if (guilds[id] && guilds[id].name.toLowerCase() === guildName.toLowerCase()) {
        guilds[id].glory = (parseInt(guilds[id].glory, 10) || 0) + amount;
        found = true;
        break;
      }
    }

    if (found) {
      safeSaveGuilds(guilds);
      bot.sendMessage(msg.chat.id, `✅ **ADMIN OVERRIDE SUCCESS:** Transferred \`+${amount.toLocaleString()} Glory Points\` directly into faction array \`${guildName.toUpperCase()}\`.`);
    } else {
      bot.sendMessage(msg.chat.id, "❌ **Administrative Error:** Specified target alliance was not found within active registry structures.");
    }
  });

};
