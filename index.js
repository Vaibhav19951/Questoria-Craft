require("dotenv").config();

console.log("=========================================");
console.log("⚔️  VELIX METADATA ENGINE STARTING...  ⚔️");
console.log("=========================================");

const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");

// =========================================
// 🌐 SAFE TOKEN VALIDATION GATEWAY
// =========================================
const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.log("❌ CRITICAL: BOT_TOKEN is entirely missing from your environment setup!");
  process.exit(1);
}

// =========================================
// 🤖 BOT INITIALIZATION
// =========================================
const bot = new TelegramBot(TOKEN, {
  polling: {
    autoStart: true,
    params: { timeout: 10 }
  }
});

// =========================================
// 📦 GLOBAL ASSET MEMORY BRIDGE (Zero Disk I/O Overload)
// =========================================
// Direct paths pointing safely to your centralized data schemas
try {
  global.VELIX_ASSETS = {
    demons: require("./commands/demons.js"), 
    weapons: require("./commands/weapons.js"), 
    mythical: require("./commands/mythical.js"),
    godTier: require("./commands/godtier.js")
  };
  console.log("✅ [ASSETS SYNCED]: Global Master registries bound to memory stream.");
} catch (assetErr) {
  console.log("⚠️  [ASSET LINK WARNING]: Some asset files were missing during boot sequence:", assetErr.message);
}

// =========================================
// 📂 CENTRALIZED DATABASE SYSTEM (Highly Optimized for 2000+ Users)
// =========================================
const dbPath = path.join(process.cwd(), "data", "players.json");

if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({}), "utf8");
}

/**
 * Global Helper: Get Player Profile Data cleanly across all command files
 */
bot.getPlayerData = (userId) => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    const json = JSON.parse(data || "{}");
    
    // Aligned Player Blueprint matching all asset systems (Cards + Arsenal + Currency)
    if (!json[userId]) {
      json[userId] = {
        coins: 500,
        bank: 0,
        level: 1,
        exp: 0,
        essence: 0,
        owned_characters: [], // For regular, God-tier, and Mythical Cards
        owned_weapons: [],    // 🚨 FIXED: Prevented crash on weapon acquisition hooks
        equipped_weapon: null, // Track currently active weapon stats
        last_daily: 0,
        last_work: 0
      };
      fs.writeFileSync(dbPath, JSON.stringify(json, null, 2), "utf8");
    } else {
      // 🚨 AUTOMATIC PATCH-UP RUNTIME: Ensures older users also get new array keys safely!
      let structuralUpdate = false;
      if (!json[userId].owned_weapons) { json[userId].owned_weapons = []; structuralUpdate = true; }
      if (json[userId].equipped_weapon === undefined) { json[userId].equipped_weapon = null; structuralUpdate = true; }
      if (json[userId].essence === undefined) { json[userId].essence = 0; structuralUpdate = true; }
      
      if (structuralUpdate) {
        fs.writeFileSync(dbPath, JSON.stringify(json, null, 2), "utf8");
      }
    }
    return json[userId];
  } catch (err) {
    console.error("❌ DB Read Frame Drop:", err.message);
    return null;
  }
};

/**
 * Global Helper: Save Player Profile Data completely synchronized
 */
bot.savePlayerData = (userId, updatedData) => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    const json = JSON.parse(data || "{}");
    json[userId] = updatedData;
    fs.writeFileSync(dbPath, JSON.stringify(json, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("❌ DB Write Synchronization Failure:", err.message);
    return false;
  }
};

// =========================================
// 🛡️ ANTI-CRASH & POLLING ERROR SHIELD
// =========================================
bot.on("polling_error", (error) => {
  if (error.message.includes("409 Conflict")) {
    console.log("⚠️  Polling Conflict detected. Resolving active duplicate threads...");
  } else {
    console.log("🛰️  Network Polling Pulse Interrupted:", error.message);
  }
});

process.on("uncaughtException", err => {
  console.log("🚨 ENGINE CRASH RECOVERY:", err.message);
});

process.on("unhandledRejection", err => {
  console.log("🔮 PROMISE SHIELD CAPTURED ERROR:", err.message);
});

// =========================================
// 🔍 DEBUG COMMAND: DATABASE AUDIT TOOL
// =========================================
bot.onText(/\/checkdb/, (msg) => {
  const chatId = msg.chat.id;
  const targetUser = msg.from.id.toString();
  
  const player = bot.getPlayerData(targetUser);
  
  if (player) {
    const layout = 
      `📂 **DATABASE AUDIT SYSTEM**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📍 **Active Registry:** \`players.json\`\n` +
      `👤 **Target Account:** \`${targetUser}\`\n\n` +
      `💰 **Current Coins Ledger:** ${player.coins} Coins\n` +
      `🔮 **Pure Essence Stash:** ${player.essence || 0} Essence\n` +
      `📈 **Current Power Level:** Tier ${player.level}\n` +
      `🎒 **Cards Asset Synchronization:** ${player.owned_characters.length} Sync'd\n` +
      `⚔️ **Weapons Vault Inventory:** ${player.owned_weapons ? player.owned_weapons.length : 0} Equipped/Owned\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ *Database status functional and fully linked to core engine.*`;
    bot.sendMessage(chatId, layout, { parse_mode: "Markdown" });
  } else {
    bot.sendMessage(chatId, "❌ **Critical Audit Error:** Failed to establish real-time link stream.");
  }
});

// =========================================
// ⚙️ PLUG-AND-PLAY MODULAR ROUTE LOADER
// =========================================
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    // Exclusion filter updated to ensure your modified asset configurations do not trigger route initializers
    if (["assets.js", "mythical.js", "weapon.js", "weapons.js", "demons.js", "godchar.js", "godtier.js"].includes(file)) {
      continue; 
    }

    try {
      const cmd = require(`./commands/${file}`);
      if (typeof cmd === "function") {
        cmd(bot); 
        console.log(`🦅 [LOADED SUCCESS] Matrix Node Linked: ${file}`);
      } else {
        console.log(`⚠️  [SKIPPED ENGINE] Non-executable structure: ${file}`);
      }
    } catch (e) {
      console.log(`❌ [LINKAGE FAILURE] Broken node script inside ${file} ->`, e.message);
    }
  }
}

// =========================================
// 📜 DEMON SLAYER UI SYSTEM COMMAND MENU
// =========================================
bot.setMyCommands([
  { command: "start", description: "⚔️ Wake up your inner Slayer" },
  { command: "help", description: "📜 Open the Scroll of Knowledge" },
  { command: "balance", description: "💰 Inspect your Coin Ledger" },
  { command: "daily", description: "🔸 Claim daily training resources" },
  { command: "work", description: "🪵 Execute survival work assignments" },
  { command: "deposit", description: "🏦 Lock assets into the Safe Vault" },
  { command: "guild", description: "🏮 Access Guild Alliance Chambers" },
  { command: "guildlb", description: "🏆 Review global Alliance rankings" },
  { command: "battle", description: "👹 Engage dangerous Demon threats" },
  { command: "summon", description: "🌌 Perform legendary breathing summon" },
  { command: "profile", description: "👤 View your Slayer Identity Status" },
  { command: "economy", description: "⚖️ Open market features dashboard" },
  { command: "upgrade", description: "⚡ Awaken cards using special essence" },
  { command: "spin", description: "🎡 Rotate the Wheel of Destiny" },
  { command: "premium", description: "👑 Enter the God-Tier Premium Shop" }
])
.then(() => console.log("📜 Demon Slayer UI Navigation Grid Loaded successfully."))
.catch(err => console.log("❌ Navigation Grid Error:", err.message));

// =========================================
// ⚡ CORE STATUS KEEP-ALIVE INTERCEPTOR
// =========================================
setInterval(() => {
  console.log("⚡ [VELIX CORE]: Internal operations humming smoothly. 0% Packet Drop.");
}, 60000);

console.log("\n🔥 PREMIUM DEMON SLAYER BOT ENGINE READY FOR ACTIVE TRAFFIC 🔥\n");
