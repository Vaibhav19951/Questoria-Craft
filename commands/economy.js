console.log("💰 ECONOMY ENGINE RUNNING WITH SYNC FIX (VELIX OS V2.5)");

const fs = require("fs");
const path = require("path");

// ✅ process.cwd() use karne se bot hamesha root ke data/players.json ko target karega, folder structure chahe jo ho
const playerFile = path.join(process.cwd(), "data", "players.json");

// Centralized DB Helper
const getDB = () => {
    try {
        if (!fs.existsSync(playerFile)) return {};
        return JSON.parse(fs.readFileSync(playerFile, "utf8"));
    } catch (e) { 
        console.error("🔥 Economy Read Error:", e);
        return {}; 
    }
};

const saveDB = (data) => {
    try {
        fs.writeFileSync(playerFile, JSON.stringify(data, null, 2), "utf8");
    } catch (e) {
        console.error("🔥 Economy Write Error:", e);
    }
};

module.exports = (bot) => {

    // ==========================================
    // 1. BALANCE COMMAND (ALIGNED WITH PROFILE)
    // ==========================================
    bot.onText(/\/(?:balance|bal)/, (msg) => {
        const userId = msg.from.id.toString();
        const db = getDB();
        const p = db[userId];

        if (!p) return bot.sendMessage(msg.chat.id, "❌ Please use /profile or /start to register first!");
        
        // Ensure structural fields are up to date
        const pocketCash = p.coins !== undefined ? Number(p.coins) : 0;
        const bankBalance = p.bank !== undefined ? Number(p.bank) : 0;
        const slayerTokens = p.tokens !== undefined ? Number(p.tokens) : 0;

        const text = `⚔️ **SLAYER BALANCES** ⚔️\n━━━━━━━━━━━━━━━━━━━━\n👛 **Wallet Cash:** \`${pocketCash.toLocaleString()} coins\`\n🏦 **Personal Bank:** \`${bankBalance.toLocaleString()} coins\`\n🎴 **Slayer Tokens:** \`${slayerTokens.toLocaleString()} tokens\`\n━━━━━━━━━━━━━━━━━━━━\nℹ️ *Use \`/dep [amount]\` to move cash to bank!*`;
        
        bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
    });

    // ==========================================
    // 2. WORK COMMAND
    // ==========================================
    bot.onText(/\/work/, (msg) => {
        const userId = msg.from.id.toString();
        let db = getDB();
        
        if (!db[userId]) return bot.sendMessage(msg.chat.id, "❌ Register with /profile first!");

        const earnings = Math.floor(Math.random() * 150) + 50;
        db[userId].coins = Number(db[userId].coins || 0) + earnings;
        
        saveDB(db); 
        
        bot.sendMessage(msg.chat.id, `💼 You worked and earned *${earnings} coins*! Added to your wallet.`, { parse_mode: "Markdown" });
    });

    // ==========================================
    // 3. PERSONAL BANK DEPOSIT COMMAND
    // ==========================================
    bot.onText(/\/dep(?: (.+))?/, (msg, match) => {
        const userId = msg.from.id.toString();
        let db = getDB();
        let p = db[userId];
        
        if (!p) return bot.sendMessage(msg.chat.id, "❌ Register with /profile first!");
        if (p.coins === undefined) p.coins = 0;
        if (p.bank === undefined) p.bank = 0;

        if (!match[1]) {
            return bot.sendMessage(msg.chat.id, "ℹ️ *Usage:* \`/dep [amount]\` or \`/dep all\`", { parse_mode: "Markdown" });
        }

        let amount = match[1].trim().toLowerCase() === "all" ? Number(p.coins) : Number(match[1]);

        if (isNaN(amount) || amount <= 0) {
            return bot.sendMessage(msg.chat.id, "❌ Please specify a valid amount to deposit.");
        }

        if (amount > Number(p.coins)) {
            return bot.sendMessage(msg.chat.id, `❌ Insufficient Cash! You only have \`${Number(p.coins).toLocaleString()}\` coins in your wallet.`, { parse_mode: "Markdown" });
        }

        p.coins = Number(p.coins) - amount;
        p.bank = Number(p.bank) + amount;
        
        saveDB(db); 
        bot.sendMessage(msg.chat.id, `🏦 **Personal Bank Deposit:** Successfully shifted \`${amount.toLocaleString()} coins\` into your vault!`, { parse_mode: "Markdown" });
    });

    // ==========================================
    // 4. PERSONAL BANK WITHDRAW COMMAND
    // ==========================================
    bot.onText(/\/with(?: (.+))?/, (msg, match) => {
        const userId = msg.from.id.toString();
        let db = getDB();
        let p = db[userId];
        
        if (!p) return bot.sendMessage(msg.chat.id, "❌ Register with /profile first!");
        if (p.coins === undefined) p.coins = 0;
        if (p.bank === undefined) p.bank = 0;

        if (!match[1]) {
            return bot.sendMessage(msg.chat.id, "ℹ️ *Usage:* \`/with [amount]\` or \`/with all\`", { parse_mode: "Markdown" });
        }

        let amount = match[1].trim().toLowerCase() === "all" ? Number(p.bank) : Number(match[1]);

        if (isNaN(amount) || amount <= 0) {
            return bot.sendMessage(msg.chat.id, "❌ Please specify a valid amount to withdraw.");
        }

        if (amount > Number(p.bank)) {
            return bot.sendMessage(msg.chat.id, `❌ Insufficient Funds! You only have \`${Number(p.bank).toLocaleString()}\` coins in your bank.`, { parse_mode: "Markdown" });
        }

        p.bank = Number(p.bank) - amount;
        p.coins = Number(p.coins) + amount;
        
        saveDB(db); 
        bot.sendMessage(msg.chat.id, `🔓 **Personal Bank Withdrawal:** Moved \`${amount.toLocaleString()} coins\` back into your pocket wallet!`, { parse_mode: "Markdown" });
    });

};