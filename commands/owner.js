const fs = require("fs");
const path = require("path");

const playersPath = path.join(__dirname, "../data/players.json");
const guildsPath = path.join(__dirname, "../data/guild.json");

// SAFE INITIAL MODULE LOADING
let players = {};
let guilds = {};

try {
  if (!fs.existsSync(path.dirname(playersPath))) fs.mkdirSync(path.dirname(playersPath), { recursive: true });
  if (!fs.existsSync(playersPath)) fs.writeFileSync(playersPath, JSON.stringify({}), "utf8");
  if (!fs.existsSync(guildsPath)) fs.writeFileSync(guildsPath, JSON.stringify({}), "utf8");

  players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
  guilds = JSON.parse(fs.readFileSync(guildsPath, "utf8"));
} catch (e) {
  console.log("⚠️ Error loading JSON configuration bases inside owner.js:", e.message);
}

const saveAll = () => {
  fs.writeFileSync(playersPath, JSON.stringify(players, null, 2), "utf8");
  fs.writeFileSync(guildsPath, JSON.stringify(guilds, null, 2), "utf8");
};

const OWNER_ID = "2086993762";
const isOwner = (msg) => msg.from.id.toString() === OWNER_ID;

const getPlayer = (id) => {
  if (!players[id]) {
    players[id] = { coins: 0, mythicalCrystals: 0, inventory: [], level: 1, xp: 0 };
    saveAll();
  }
  // Ensure array metrics exist so index alterations don't break
  if (!players[id].inventory) players[id].inventory = [];
  return players[id];
};

module.exports = (bot) => {

  // Syncs admin/user names to profiles during lookups
  const registerUsername = (msg) => {
    if (msg.from && msg.from.username) {
      const p = getPlayer(msg.from.id.toString());
      p.username = msg.from.username;
      saveAll();
    }
  };

  // ==========================================
  // 👑 MAIN OWNER PANEL VIEW
  // ==========================================
  bot.onText(/\/owner/, (msg) => {
    if (!isOwner(msg)) return;
    registerUsername(msg);
    
    bot.sendAnimation(
      msg.chat.id,
      "https://i.pinimg.com/originals/e2/f7/45/e2f745698b639d14dbd4c1567e5f03d6.gif",
      {
        caption: `👑 **VELIX MASTER ARCHITECT CONTROL MATRIX**\n\n` +
                 `💰 \`/addcoins ID AMOUNT\`\n` +
                 `💰 \`/removecoins ID AMOUNT\`\n` +
                 `💎 \`/addtokens ID AMOUNT\`\n` +
                 `💎 \`/removetokens ID AMOUNT\`\n\n` +
                 `🧬 \`/addcharacter USERID Name|Image|Type\`\n` +
                 `🗑️ \`/removecharacter USERID CharacterID\`\n\n` +
                 `👤 \`/checkplayer ID\`\n` +
                 `🔄 \`/resetplayer ID\`\n\n` +
                 ` Castle Utilities:\n` +
                 `🏰 \`/deleteguild GUILD_ID_OR_NAME\``,
        parse_mode: "Markdown"
      }
    );
  });

  // QUICK LOOKUP HELP ROUTE
  bot.onText(/\/myid/, (msg) => bot.sendMessage(msg.chat.id, `🆔 \`${msg.from.id}\``, { parse_mode: "Markdown" }));

  // ==========================================
  // 🪙 CURRENCY MANIPULATION COMMANDS
  // ==========================================
  
  // ADD COINS
  bot.onText(/\/addcoins (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const p = getPlayer(match[1]);
    p.coins += parseInt(match[2], 10);
    saveAll();
    bot.sendMessage(msg.chat.id, `✅ **Transaction Complete:** Injected +${parseInt(match[2], 10).toLocaleString()} Coins to ID: \`${match[1]}\``, { parse_mode: "Markdown" });
  });

  // REMOVE COINS
  bot.onText(/\/removecoins (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const p = getPlayer(match[1]);
    const amount = parseInt(match[2], 10);
    p.coins = Math.max(0, (p.coins || 0) - amount);
    saveAll();
    bot.sendMessage(msg.chat.id, `✅ **Transaction Complete:** Subtracted -${amount.toLocaleString()} Coins from ID: \`${match[1]}\``, { parse_mode: "Markdown" });
  });

  // ADD TOKENS (Mythical Crystals)
  bot.onText(/\/addtokens (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const p = getPlayer(match[1]);
    p.mythicalCrystals += parseInt(match[2], 10);
    saveAll();
    bot.sendMessage(msg.chat.id, `✅ **Transaction Complete:** Injected +${parseInt(match[2], 10).toLocaleString()} Crystals to ID: \`${match[1]}\``, { parse_mode: "Markdown" });
  });

  // REMOVE TOKENS (Mythical Crystals)
  bot.onText(/\/removetokens (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const p = getPlayer(match[1]);
    const amount = parseInt(match[2], 10);
    p.mythicalCrystals = Math.max(0, (p.mythicalCrystals || 0) - amount);
    saveAll();
    bot.sendMessage(msg.chat.id, `✅ **Transaction Complete:** Subtracted -${amount.toLocaleString()} Crystals from ID: \`${match[1]}\``, { parse_mode: "Markdown" });
  });

  // ==========================================
  // 🧬 CHARACTER MANAGEMENT COMMANDS
  // ==========================================

  // FORCE ADD CHARACTER
  bot.onText(/\/addcharacter (\d+) (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const userId = match[1];
    const input = match[2].split("|");
    
    if (input.length < 3) return bot.sendMessage(msg.chat.id, "❌ **Format Error:** Use structure: `/addcharacter USERID Name|Image|Type`", { parse_mode: "Markdown" });
    
    const p = getPlayer(userId);
    const charId = "c" + Date.now();
    
    // Packs matching string configurations into array files
    p.inventory.push(`${charId}|${input[0].trim()}|${input[1].trim()}|${input[2].trim()}`);
    saveAll();
    
    bot.sendMessage(msg.chat.id, `✅ **Character Dropped Successfully!**\n\n🔖 **Name:** ${input[0].trim()}\n⚡ **Type:** ${input[2].trim()}\n🆔 **UID Generated:** \`${charId}\``, { parse_mode: "Markdown" });
  });

  // FORCE REMOVE CHARACTER
  bot.onText(/\/removecharacter (\d+) (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const userId = match[1];
    const targetCharId = match[2].trim();
    
    if (!players[userId]) return bot.sendMessage(msg.chat.id, "❌ User profile registry not found inside database logs.");
    
    const p = getPlayer(userId);
    const initialLength = p.inventory.length;
    
    // Filters out the character matching the unique card ID string
    p.inventory = p.inventory.filter(item => !item.startsWith(targetCharId + "|"));
    
    if (p.inventory.length === initialLength) {
      return bot.sendMessage(msg.chat.id, `❌ Character unique string \`${targetCharId}\` was not located inside user inventory array.`, { parse_mode: "Markdown" });
    }
    
    saveAll();
    bot.sendMessage(msg.chat.id, `🗑️ **Inventory Mutation Complete:** Forcefully deleted character item \`${targetCharId}\` from profile log record \`${userId}\`.`, { parse_mode: "Markdown" });
  });

  // ==========================================
  // 🔍 SYSTEM AND FILE CONTROL TOOLS
  // ==========================================

  // CHECK PLAYER STATS DIGEST
  bot.onText(/\/checkplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const targetId = match[1];
    
    if (!players[targetId]) return bot.sendMessage(msg.chat.id, "❌ **Registry Search Failure:** Specified target user id has no generated storage profile rows.");
    
    const p = players[targetId];
    const handle = p.username ? `@${p.username}` : "Unsaved Handle";
    
    const evaluationString = 
      `👤 **PLAYER RECORD SPECS FOR USER ID: [${targetId}]**\n` +
      `-----------------------------------------\n` +
      `🏷️ **Handle/Username:** ${handle}\n` +
      `🎚️ **Level Progress:** Level ${p.level || 1} (${p.xp || 0} XP)\n` +
      `🪙 **Gold Balance Stock:** ${(p.coins || 0).toLocaleString()} Coins\n` +
      `💎 **Crystal Balances:** ${(p.mythicalCrystals || 0).toLocaleString()} Crystals\n` +
      `📦 **Inventory Items:** ${(p.inventory || []).length} Character Nodes registered.`;
      
    bot.sendMessage(msg.chat.id, evaluationString, { parse_mode: "Markdown" });
  });

  // HARD RESET USER FACTORY MATRIX
  bot.onText(/\/resetplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    delete players[match[1]];
    saveAll();
    bot.sendMessage(msg.chat.id, `🔄 **System Override Action:** Reset completed successfully. Database entry row for \`${match[1]}\` dropped cleanly.`, { parse_mode: "Markdown" });
  });

  // WIPE GUILD OUT OF EXISTENCE
  bot.onText(/\/deleteguild (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const targetGuildKey = match[1].trim();
    
    // Checks if key matches direct structural object references or property blocks
    if (guilds[targetGuildKey]) {
      delete guilds[targetGuildKey];
      saveAll();
      return bot.sendMessage(msg.chat.id, `🏰 **Alliance Matrix Cleared:** Erased guild key entry \`${targetGuildKey}\` completely from database logs.`, { parse_mode: "Markdown" });
    }
    
    // Look up via dynamic subproperty loop iteration searches if a human-typed string title is given
    let foundKey = null;
    for (const [id, data] of Object.entries(guilds)) {
      if (data.name && data.name.toLowerCase() === targetGuildKey.toLowerCase()) {
        foundKey = id;
        break;
      }
    }
    
    if (foundKey) {
      delete guilds[foundKey];
      saveAll();
      bot.sendMessage(msg.chat.id, `🏰 **Alliance Matrix Cleared:** Located and erased guild name matches for **${targetGuildKey}** successfully.`, { parse_mode: "Markdown" });
    } else {
      bot.sendMessage(msg.chat.id, `❌ **Search Aborted:** Guild identity key string matching \`${targetGuildKey}\` wasn't tracked inside cluster maps.`, { parse_mode: "Markdown" });
    }
  });

};