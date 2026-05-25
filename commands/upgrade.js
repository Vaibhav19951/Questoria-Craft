// ==========================================
// ⚔️ NICHIRIN FORGE | CHARACTER UPGRADE ENGINE
// ==========================================
const mythicCards = [
    { id: "tanjiro_mythic", name: "Kamado Tanjiro (Sun Breathing)" },
    { id: "nezuko_mythic", name: "Kamado Nezuko (Awakened Form)" },
    { id: "zenitsu_mythic", name: "Agatsuma Zenitsu (Godspeed)" },
    { id: "muzan_mythic", name: "Kibutsuji Muzan (Demon King)" }
];

module.exports = (bot) => {
    bot.onText(/\/upgrade(?:\s+(.+))?/, (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();

        // 🚨 FIXED: Integrated directly with the new central ledger hooks
        const player = bot.getPlayerData(userId);
        if (!player) return;

        const inputChar = match[1] ? match[1].trim().toLowerCase() : "";

        if (!inputChar) {
            return bot.sendMessage(chatId, 
                `⚔️ **NICHIRIN FORGE | UPGRADE STATION**\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `❌ **Syntax Error!** Please specify a valid character name.\n` +
                `👉 *Usage:* \`/upgrade tanjiro\` or \`/upgrade nezuko\`\n\n` +
                `ℹ️ Every level upgrade requires **10x Slayer Tokens** 🎟️.\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                { parse_mode: "Markdown" }
            );
        }

        // Search character inside standard player.inventory structure
        let baseCharIndex = player.inventory.findIndex(item => {
            let name = typeof item === "string" ? item : (item.name || "");
            return name.toLowerCase().includes(inputChar);
        });

        if (baseCharIndex === -1) {
            return bot.sendMessage(chatId, `❌ **Slayer Alert!** You do not own this character in your inventory grid yet. Extraction required via /summon first.`);
        }

        let rawCharacter = player.inventory[baseCharIndex];
        let charObject = { name: "", level: 1 };
        
        if (typeof rawCharacter === "string") {
            charObject.name = rawCharacter;
            charObject.level = 1;
        } else {
            charObject.name = rawCharacter.name || "Unknown Slayer";
            charObject.level = parseInt(rawCharacter.level, 10) || 1;
        }

        if (charObject.level >= 5) {
            return bot.sendMessage(chatId, `👑 **Max Horizon Reached!** \`${charObject.name}\` is already at **Level 5 (Max Apex Rank)**.`);
        }

        // 🚨 FIXED: Replaced non-existent materials object with dynamic Token configuration
        if (player.tokens === undefined) player.tokens = 0;
        const requiredTokens = 10; // Base upgrade token cost

        if (player.tokens < requiredTokens) {
            return bot.sendMessage(chatId, 
                `🎟️ **RESOURCES DEPLETED | UPGRADE FAILED**\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `Insufficient core components for the ascension matrix:\n\n` +
                `• Character: \`${charObject.name}\` (Lv. ${charObject.level})\n` +
                `• Required: 🎟️ \`${requiredTokens}\` Slayer Tokens\n` +
                `• Available: 🎟️ \`${player.tokens}\` Slayer Tokens\n\n` +
                `💡 *Tip:* Participate in active core modules to stack tokens.\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                { parse_mode: "Markdown" }
            );
        }

        // Deduct Tokens & Increase level array matrix
        player.tokens -= requiredTokens;
        charObject.level += 1;
        player.inventory[baseCharIndex] = charObject;

        // 🚨 FIXED: Committing mutations to central file system securely
        bot.savePlayerData(userId, player);

        let basePower = charObject.level * 150;
        let originalPower = (charObject.level - 1) * 150;

        bot.sendMessage(chatId, 
            `🔥 **BREATHING ASCENSION COMPLETED!**\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `The target soul matrix has successfully broken through its limits!\n\n` +
            `⚔️ **Character:** \`${charObject.name}\`\n` +
            `📈 **Rank Evolution:** Level \`${charObject.level - 1}\` ➔ **Level \`${charObject.level}\`**\n` +
            `🔱 **Combat Power:** \`${originalPower}\` ➔ \`${basePower} CP\`\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `🎟️ *Deducted ${requiredTokens}x Slayer Tokens from your core wallet matrix.*`,
            { parse_mode: "Markdown" }
        );
    });
};
