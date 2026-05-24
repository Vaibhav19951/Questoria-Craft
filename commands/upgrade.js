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

        if (!global.economyDB) return console.log("⚠️ Economy Core not loaded yet!");

        let db = global.economyDB.getDB();
        db[userId] = global.economyDB.sanitizeUserObject(db[userId]);
        let p = db[userId];

        const inputChar = match[1] ? match[1].trim().toLowerCase() : "";

        if (!inputChar) {
            return bot.sendMessage(chatId, 
                `⚔️ **NICHIRIN FORGE | UPGRADE STATION**\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `❌ **Syntax Error!** Please specify a valid character name.\n` +
                `👉 *Usage:* \`/upgrade tanjiro\` or \`/upgrade nezuko\`\n\n` +
                `ℹ️ Every level upgrade requires **5x Character Essence**.\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                { parse_mode: "Markdown" }
            );
        }

        let baseCharIndex = p.inventory.findIndex(item => {
            let name = typeof item === "string" ? item : (item.name || "");
            return name.toLowerCase().includes(inputChar);
        });

        if (baseCharIndex === -1) {
            return bot.sendMessage(chatId, `❌ **Slayer Alert!** You do not own this character in your primary squad grid yet. Extraction required via /spin first.`);
        }

        let rawCharacter = p.inventory[baseCharIndex];
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

        let matchedMythic = mythicCards.find(c => c.name.toLowerCase().includes(inputChar));
        let charId = matchedMythic ? matchedMythic.id.split('_')[0] : inputChar.replace(/\s+/g, '');
        let essenceKey = `${charId}_essence`;

        let currentEssenceCount = parseInt(p.materials[essenceKey], 10) || 0;
        const requiredEssence = 5;

        if (currentEssenceCount < requiredEssence) {
            return bot.sendMessage(chatId, 
                `🧪 **RESOURCES DEPLETED | UPGRADE FAILED**\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `Insufficient core components for the ascension matrix:\n\n` +
                `• Character: \`${charObject.name}\` (Lv. ${charObject.level})\n` +
                `• Required: 🧪 \`${requiredEssence}\` ${essenceKey.toUpperCase()}\n` +
                `• Available: 🧪 \`${currentEssenceCount}\` ${essenceKey.toUpperCase()}\n\n` +
                `💡 *Tip:* Pull duplicates from **Mythic Spin** to automatically accumulate essence.\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                { parse_mode: "Markdown" }
            );
        }

        p.materials[essenceKey] = currentEssenceCount - requiredEssence;
        charObject.level += 1;
        p.inventory[baseCharIndex] = charObject;

        db[userId] = global.economyDB.sanitizeUserObject(p);
        global.economyDB.saveDB(db);

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
            `🧪 *Deducted 5x ${essenceKey.toUpperCase()} from storage bank material slots.*`,
            { parse_mode: "Markdown" }
        );
    });
};
