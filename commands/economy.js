/**
 * VELIX OS V2.5 - AUTOMATED CORPS ECONOMY MODULE
 * Optimized for High-Concurrency Traffic (2000+ Users)
 * 🚨 FIXED: Aligned perfectly with core schema (inventory & mythicalCrystals)
 */

module.exports = (bot) => {

    // 🏦 /balance - INSPECT SLAYER FINANCIAL REGISTRY
    bot.onText(/\/balance/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();

        // Centralized Data Fetch
        const player = bot.getPlayerData(userId);
        if (!player) return;

        // 🚨 FIXED: Fallback variables mapped precisely to index.js configuration keys
        const crystals = player.mythicalCrystals !== undefined ? player.mythicalCrystals : 0;
        const essence = player.essence !== undefined ? player.essence : 0;
        const ownedChars = player.inventory ? player.inventory.length : 0;

        const report = 
            `🏮 **VELIX OS | SLAYER FINANCIAL REGISTRY** 🏮\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
            `👤 **Slayer Account:** \`${userId}\`\n` +
            `⚔️ **Corps Status:** Verified\n\n` +
            `• 🪙 **Crow Coins:** \`${player.coins.toLocaleString()}\`\n` +
            `• 💎 **Crystals:** \`${crystals.toLocaleString()}\`\n` +
            `• ✨ **Primary Essence:** \`${essence.toLocaleString()}\`\n\n` +
            `💼 **Inventory Status:** \`${ownedChars}\` Cards synchronized.\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🦅 *Keep your vault guarded. The Muzan threats grow close.*`;

        bot.sendMessage(chatId, report, { parse_mode: "Markdown" }).catch(err => console.error("❌ Balance view drop failure:", err.message));
    });

    // ⚒️ /work - PATROL SURROUNDING SECTORS
    bot.onText(/\/work/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();
        const now = Date.now();
        const cooldown = 5 * 60 * 1000; // 5 Minutes Cooldown

        const player = bot.getPlayerData(userId);
        if (!player) return;

        if (!player.last_work) player.last_work = 0;

        if (now - player.last_work < cooldown) {
            const remaining = Math.ceil((cooldown - (now - player.last_work)) / 1000);
            return bot.sendMessage(chatId, `⏳ **Exhaustion Alert!**\n━━━━━━━━━━━━━━━━━━━━━\nSlayers need rest to preserve their Breathing Styles. Your stamina restores in \`${remaining}s\`.`);
        }

        const payout = Math.floor(Math.random() * 80) + 50;
        player.coins += payout;
        player.last_work = now;

        bot.savePlayerData(userId, player);

        const workSucessReport = 
            `🦅 **CORPS PATROL SUCCESSFUL**\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `You deployed into the dark perimeter sectors, neutralized a minor demon scout threat, and secured the village line.\n\n` +
            `💰 **Reward Dispatched:** 🪙 \`${payout}\` Crow Coins\n` +
            `⚖️ **Ledger Status:** Profile balances synchronized.`;

        bot.sendMessage(chatId, workSucessReport, { parse_mode: "Markdown" });
    });

    // 📜 /task - CORE RANK EXPEDITION ORDERS
    bot.onText(/\/task/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();
        const now = Date.now();
        const cooldown = 20 * 60 * 60 * 1000; // 20 Hours Cooldown

        const player = bot.getPlayerData(userId);
        if (!player) return;

        if (!player.last_task) player.last_task = 0;
        if (player.mythicalCrystals === undefined) player.mythicalCrystals = 0; // 🚨 FIXED KEY

        if (now - player.last_task < cooldown) {
            const remainingMs = cooldown - (now - player.last_task);
            const remHrs = Math.floor(remainingMs / (1000 * 60 * 60));
            const remMins = Math.ceil((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
            return bot.sendMessage(chatId, `📜 **DEMON CREST ENVELOPE LOCKED**\n━━━━━━━━━━━━━━━━━━━━━\nThe Kasugai Crow is still gathering intel. Next official high-tier rank orders arrive in \`${remHrs}h ${remMins}m\`.`);
        }

        const coinReward = 200;
        const crystalReward = 2;

        player.coins += coinReward;
        player.mythicalCrystals += crystalReward; // 🚨 FIXED KEY
        player.last_task = now;

        bot.savePlayerData(userId, player);

        const missionReport = 
            `📜 **MISSION COMPLETION NOTICE**\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `Rank mission objectives fully achieved! Your battle report has been reviewed at headquarters.\n\n` +
            `**Acquired Assets Loot Drop:**\n` +
            `• 🪙 \`${coinReward}\` Crow Coins\n` +
            `• 💎 \`${crystalReward}\` Precious Crystals\n` +
            `━━━━━━━━━━━━━━━━━━━━━\n` +
            `✅ *Transaction secure. Assets loaded to profile ledger.*`;

        bot.sendMessage(chatId, missionReport, { parse_mode: "Markdown" });
    });

    // 🔀 /convert - VAULT ASSET EXCHANGE FORMULA
    bot.onText(/\/convert\s*(\w*)\s*(\d*)/, (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();

        const player = bot.getPlayerData(userId);
        if (!player) return;

        if (player.mythicalCrystals === undefined) player.mythicalCrystals = 0; // 🚨 FIXED KEY

        const direction = match[1] ? match[1].toLowerCase() : "";
        const amount = parseInt(match[2], 10);

        if (!direction || !amount || amount <= 0) {
            const syntaxLayout = 
                `❌ **INVALID EXCHANGE SYNTAX**\n` +
                `━━━━━━━━━━━━━━━━━━━━━\n` +
                `👉 **Command Usage:** \`/convert c2cr <amount>\`\n\n` +
                `📊 **Official Exchange Rates:**\n` +
                `└── \`100 Crow Coins\` ➡️ \`1 Precious Crystal\``;
            return bot.sendMessage(chatId, syntaxLayout, { parse_mode: "Markdown" });
        }

        if (direction === "c2cr") {
            const cost = amount * 100;
            if (player.coins < cost) {
                return bot.sendMessage(chatId, `❌ **INSUFFICIENT CAPITAL**\n━━━━━━━━━━━━━━━━━━━━━\nThis trade action requires 🪙 \`${cost}\` Crow Coins to authorize the transformation into 💎 \`${amount}\` Crystals.`);
            }

            player.coins -= cost;
            player.mythicalCrystals += amount; // 🚨 FIXED KEY

            bot.savePlayerData(userId, player);

            const conversionReport = 
                `✅ **VAULT TRANSACTION CERTIFIED**\n` +
                `━━━━━━━━━━━━━━━━━━━━━\n` +
                `The butterfly mansion accounting wing processed your conversion formula.\n\n` +
                `📉 **Deducted Assets:** 🪙 \`${cost}\` Crow Coins\n` +
                `📈 **Credited Assets:** 💎 \`${amount}\` Precious Crystals\n` +
                `━━━━━━━━━━━━━━━━━━━━━\n` +
                `✨ *Vault ledgers have updated completely.*`;

            bot.sendMessage(chatId, conversionReport, { parse_mode: "Markdown" });
        } else {
            bot.sendMessage(chatId, "❌ **UNKNOWN FORMULA MATRIX**\n\nThe configuration profile only supports the operational trade variable: \`c2cr\`.");
        }
    });
};
