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

// Ensure data folder and players.json exist safely
if (!fs.existsSync(path.dirname(dbPath))) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({}), "utf8");
}

/**
 * Global Helper: Get Player Profile Data cleanly across all command files
 * 🚨 COMPATIBILITY PATCH: Fully integrated with original schema (inventory, xp, mythicalCrystals)
 */
bot.getPlayerData = (userId) => {
  try {
    const data = fs.readFileSync(dbPath, "utf8");
    const json = JSON.parse(data || "{}");
    
    // Default template tailored exactly to merge your original fields smoothly
    if (!json[userId]) {
      json[userId] = {
        username: "Slayer",
        coins: 500,
        bank: 0,
        mythicalCrystals: 0, 
        level: 1,
        xp: 0,               
        character: null,
        inventory: [],       // Stores regular, God-tier, and Mythical Cards
        owned_weapons: [],   // Weapon system array
        equipped_weapon: null,
        essence: 0,
        guildId: null,
        last_daily: 0,
        last_work: 0
      };
      fs.writeFileSync(dbPath, JSON.stringify(json, null, 2), "utf8");
    } else {
      // 🔄 AUTOMATIC RUNTIME PATCHER: Syncs legacy schema with new system requirements
      let structuralUpdate = false;
      
      if (json[userId].inventory === undefined) { json[userId].inventory = json[userId].owned_characters || []; structuralUpdate = true; }
      if (json[userId].xp === undefined) { json[userId].xp = json[userId].exp || 0; structuralUpdate = true; }
      if (json[userId].coins === undefined) { json[userId].coins = 0; structuralUpdate = true; }
      if (json[userId].bank === undefined) { json[userId].bank = 0; structuralUpdate = true; }
      if (json[userId].mythicalCrystals === undefined) { json[userId].mythicalCrystals = 0; structuralUpdate = true; }
      if (json[userId].owned_weapons === undefined) { json[userId].owned_weapons = []; structuralUpdate = true; }
      if (json[userId].equipped_weapon === undefined) { json[userId].equipped_weapon = null; structuralUpdate = true; }
      if (json[userId].essence === undefined) { json[userId].essence = 0; structuralUpdate = true; }
      if (json[userId].last_daily === undefined) { json[userId].last_daily = 0; structuralUpdate = true; }
      if (json[userId].last_work === undefined) { json[userId].last_work = 0; structuralUpdate = true; }
      
      // Clean up alternative temporary keys if they exist
      if (json[userId].owned_characters) { delete json[userId].owned_characters; structuralUpdate = true; }
      if (json[userId].exp) { delete json[userId].exp; structuralUpdate = true; }

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
      `👤 **Target Account:** \`${targetUser}\` (@${player.username || "N/A"})\n\n` +
      `💰 **Current Coins Ledger:** ${player.coins} Coins\n` +
      `💎 **Mythical Crystals:** ${player.mythicalCrystals} Crystals\n` +
      `🔮 **Pure Essence Stash:** ${player.essence} Essence\n` +
      `📈 **Current Power Level:** Tier ${player.level} (XP: ${player.xp})\n` +
      `🎒 **Inventory Assets:** ${player.inventory.length} Cards Sync'd\n` +
      `⚔️ **Weapons Vault:** ${player.owned_weapons.length} Owned\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ *Database status functional and fully linked to core engine.*`;
    bot.sendMessage(chatId, layout, { parse_mode: "Markdown" });
  } else {
    bot.sendMessage(chatId, "❌ **Critical Audit Error:** Failed to establish real-time link stream.");
  }
});

// =========================================
// 📸 PREMIUM PAYMENT SCREENSHOT RECEIVER
// =========================================
bot.on("photo", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username ? `@${msg.from.username}` : "No Username";

  // Check karo agar user ne photo ke saath kuch caption likha hai ya premium context chal raha hai
  const caption = msg.caption ? msg.caption.toLowerCase() : "";

  // Aap yahan ek simple check rakh sakte hain ya har photo par admin ko alert bhej sakte hain
  if (caption.includes("pay") || caption.includes("premium") || caption.includes("ss") || caption.includes("done")) {
    
    // 1. User ko confirmation bhejo
    bot.sendMessage(chatId, "⏳ **Aapka payment screenshot receive ho gaya hai!**\nAdmin (VELIX) jald hi aapki transaction verify karke aapka Premium pack activate kar denge. Kripya thoda intezar karein. ⚔️");

    // 2. ADMIN ALERTS (Apni Admin Chat ID yahan daal dena taaki aapko notification mile)
    const ADMIN_CHAT_ID = "YOUR_TELEGRAM_USER_ID_HERE"; // 🚨 REPLCAE WITH YOUR ACTUAL TELEGRAM ID
    
    // Sabse high resolution waali photo uthao
    const fileId = msg.photo[msg.photo.length - 1].file_id;

    const adminMessage = 
      `🚨 **NEW PREMIUM PAYMENT SUBMISSION** 🚨\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 **User:** ${username}\n` +
      `🆔 **ID:** \`${userId}\`\n` +
      `📝 **Caption:** ${msg.caption || "None"}\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Verify karke database mein manually ya command se crystals add karein!`;

    try {
      await bot.sendPhoto(ADMIN_CHAT_ID, fileId, { caption: adminMessage, parse_mode: "Markdown" });
    } catch (err) {
      console.log("❌ Admin ko screenshot bhejne mein error aaya:", err.message);
    }
  }
});

// =========================================
// ⚙️ PLUG-AND-PLAY MODULAR ROUTE LOADER
// =========================================
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    // Exclusion filter to prevent assets loading as command handlers
    if (["assets.js", "mythical.js", "weapon.js", "weapons.js", "demons.js", "godchar.js", "godtier.js"].includes(file)) {
      continue; 
    }

    try {
      const cmd = require(`./commands/${file}`);
      if (typeof cmd === "function") {
        cmd(bot); // Passes optimized bot parameters down cleanly
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
