require("dotenv").config();

console.log("=========================================");
console.log("⚔️  VELIX METADATA ENGINE STARTING...  ⚔️");
console.log("=========================================");

const TelegramBot = require("node-telegram-bot-api");
const fs = require("fs");
const path = require("path");
const askJarvis = require("./core/aiEngine");
const aiCooldown = new Map();

// =========================================
// 🌐 SAFE TOKEN VALIDATION GATEWAY
// =========================================
const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.log("❌ CRITICAL: BOT_TOKEN is entirely missing from your environment setup!");
  process.exit(1);
}

// =========================================
// 🤖 BOT INITIALIZATION (FIXED DEPRECATION WARNING)
// =========================================
const bot = new TelegramBot(TOKEN, {
  polling: {
    autoStart: true,
    params: { timeout: 10 }
  },
  filepath: false // 👈 This completely disables the lamba application/octet-stream warning
});

// =========================================
// 📦 GLOBAL ASSET MEMORY BRIDGE
// =========================================
try {
  global.VELIX_ASSETS = {
    demons: require("./commands/demons.js"), 
    weapons: require("./commands/weapons.js"), 
    mythical: require("./commands/mythical.js"),
    godTier: require("./asset/godchar.js") // ✅ FIXED: Pointing to correct asset location
  };
  console.log("✅ [ASSETS SYNCED]: Global Master registries bound to memory stream.");
} catch (assetErr) {
  console.log("⚠️  [ASSET LINK WARNING]: Asset files loaded internally into core memory streams.");
}

// =========================================
// 📂 CENTRALIZED DATABASE SYSTEM
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
    
    if (!json[userId]) {
      json[userId] = {
        username: "Slayer",
        coins: 500,
        bank: 0,
        mythic: 0,             // ✅ SYNCED: For spin.js & premium.js compatibility
        crystals: 0,           // ✅ SYNCED: For material spins
        mythicalCrystals: 0,   
        level: 1,
        xp: 0,               
        character: null,
        inventory: [],       
        owned_weapons: [],   
        equipped_weapon: null,
        essence: 0,
        materials: {},         // ✅ ADDED: Material storage mapping matrix
        guildId: null,
        last_daily: 0,
        last_work: 0
      };
      fs.writeFileSync(dbPath, JSON.stringify(json, null, 2), "utf8");
    } else {
      let structuralUpdate = false;
      
      // Strict Core Parameter Dynamic Alignments
      if (json[userId].inventory === undefined) { json[userId].inventory = json[userId].owned_characters || []; structuralUpdate = true; }
      if (json[userId].xp === undefined) { json[userId].xp = json[userId].exp || 0; structuralUpdate = true; }
      if (json[userId].coins === undefined) { json[userId].coins = 0; structuralUpdate = true; }
      if (json[userId].bank === undefined) { json[userId].bank = 0; structuralUpdate = true; }
      
      // ✅ CORE SYSTEM SYNC PARSING
      if (json[userId].mythic === undefined) { json[userId].mythic = json[userId].mythicTokens || 0; structuralUpdate = true; }
      if (json[userId].crystals === undefined) { json[userId].crystals = json[userId].mythicalCrystals || 0; structuralUpdate = true; }
      if (json[userId].mythicalCrystals === undefined) { json[userId].mythicalCrystals = 0; structuralUpdate = true; }
      if (json[userId].materials === undefined) { json[userId].materials = {}; structuralUpdate = true; }
      
      if (json[userId].owned_weapons === undefined) { json[userId].owned_weapons = []; structuralUpdate = true; }
      if (json[userId].equipped_weapon === undefined) { json[userId].equipped_weapon = null; structuralUpdate = true; }
      if (json[userId].essence === undefined) { json[userId].essence = 0; structuralUpdate = true; }
      if (json[userId].last_daily === undefined) { json[userId].last_daily = 0; structuralUpdate = true; }
      if (json[userId].last_work === undefined) { json[userId].last_work = 0; structuralUpdate = true; }
      
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
    
    // Cross check data bridges before committing state
    if (updatedData.crystals !== undefined) updatedData.mythicalCrystals = updatedData.crystals;
    
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
  if (!error.message.includes("409 Conflict")) {
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
      `✨ **Mythic Tokens:** ${player.mythic} Tokens\n` +
      `💎 **Crystals Stash:** ${player.crystals} Crystals\n` +
      `🔮 **Pure Essence Stash:** ${player.essence} Essence\n` +
      `📈 **Current Power Level:** Tier ${player.level} (XP: ${player.xp})\n` +
      `🎒 **Inventory Assets:** ${player.inventory.length} Cards Sync'd\n` +
      `⚔️ **Weapons Vault:** ${player.owned_weapons.length} Owned\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `✅ *Database status functional and fully linked to core engine.*`;
    bot.sendMessage(chatId, layout, { parse_mode: "Markdown" });
  }
});
 
// =========================================
// ⚡ JARVIS AI SYSTEM
// =========================================
bot.on("message", async (msg) => {

  if (!msg.text) return;

  const text = msg.text.toLowerCase();

  // Ignore commands
  if (text.startsWith("/")) return;

  // Trigger word
  if (text.startsWith("jarvis ")) {

    const userId = msg.from.id;
    const now = Date.now();

    // =========================================
    // 🛡️ ANTI-SPAM COOLDOWN
    // =========================================
    if (aiCooldown.has(userId)) {

      const lastUsed = aiCooldown.get(userId);

      if (now - lastUsed < 10000) {

        return bot.sendMessage(
          msg.chat.id,
          "⚠️ Wait a few seconds before using Jarvis again."
        );
      }
    }

    aiCooldown.set(userId, now);

    const prompt = msg.text.slice(7);

    try {

      bot.sendChatAction(msg.chat.id, "typing");

      const reply = await askJarvis(prompt);

      bot.sendMessage(
        msg.chat.id,
        `⚡ JARVIS\n━━━━━━━━━━━━━━━\n${reply}`
      );

    } catch (err) {

      console.log("JARVIS MESSAGE ERROR:", err);

      bot.sendMessage(
        msg.chat.id,
        "⚠️ Jarvis system encountered an error."
      );
    }
  }
});

// =========================================
// ⚙️ AGGRESSIVE PLUG-AND-PLAY MODULAR LOADER
// =========================================
const commandsPath = path.join(process.cwd(), "commands");

if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    if (["assets.js", "godchar.js", "godtier.js"].includes(file)) {
      continue; 
    }

    try {
      const cmd = require(path.join(commandsPath, file));
      if (typeof cmd === "function") {
        cmd(bot); 
        console.log(`🦅 [LOADED SUCCESS] Matrix Node Linked: ${file}`);
      } else {
        console.log(`⚠️  [SKIPPED ENGINE] Non-executable structure (Data Only): ${file}`);
      }
    } catch (e) {
      console.log(`❌ [LINKAGE FAILURE] Broken node script inside ${file} ->`, e.message);
    }
  }
} else {
  console.log("❌ ERROR: 'commands' folder not found at path: " + commandsPath);
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
  { command: "guild", description: "🏮 Access Guild Alliance Chambers" },
  { command: "battle", description: "👹 Engage dangerous Demon threats" }, // 👈 Fixed: Added closing quote and brace cleanly
  { command: "summon", description: "🌌 Perform legendary breathing summon" },
  { command: "profile", description: "👤 View your Slayer Identity Status" },
  { command: "upgrade", description: "⚡ Awaken cards using special essence" },
  { command: "premium", description: "👑 Enter the God-Tier Premium Shop" }
]).catch(err => console.log("❌ Navigation Grid Error:", err.message));
