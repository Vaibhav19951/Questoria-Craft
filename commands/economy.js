console.log("💰 VELIX OS | DEMON SLAYER ECONOMY ENGINE [UI v3.0 - ANTI-NAN RECOVERY]");

const fs = require("fs");
const path = require("path");
const playerFile = path.join(process.cwd(), "data", "players.json");

const { characters: normalCards } = require("../asset/assets.js");
const { mythical: mythicCards } = require("../asset/mythical.js");

const getDB = () => {
    try {
        if (!fs.existsSync(playerFile)) return {};
        const raw = fs.readFileSync(playerFile, "utf8");
        return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
};

const saveDB = (data) => {
    try {
        const tempPath = playerFile + ".tmp";
        fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
        fs.renameSync(tempPath, playerFile);
    } catch (e) { console.error("🔥 Corps Write Failure:", e); }
};

module.exports = (bot) => {

    // Anti-NaN & Null Validation Pipeline
    const sanitizeUserObject = (user) => {
        if (!user) user = {};
        
        user.coins = isNaN(parseInt(user.coins)) ? 500 : parseInt(user.coins);
        user.crystals = isNaN(parseInt(user.crystals)) ? 0 : parseInt(user.crystals);
        user.mythic = isNaN(parseInt(user.mythic)) ? 0 : parseInt(user.mythic);
        user.exp = isNaN(parseInt(user.exp)) ? 0 : parseInt(user.exp);
        user.level = isNaN(parseInt(user.level)) || parseInt(user.level) <= 0 ? 1 : parseInt(user.level);
        
        if (!user.last_daily) user.last_daily = "";
        if (!user.active_task) user.active_task = null;
        if (!user.inventory || !Array.isArray(user.inventory)) user.inventory = [];
        if (!user.materials || Array.isArray(user.materials) || typeof user.materials !== "object") user.materials = {};
        
        return user;
    };

    const ensureUser = (userId) => {
        let db = getDB();
        db[userId] = sanitizeUserObject(db[userId]);
        saveDB(db);
        return db;
    };

    const assignTask = (user) => {
        const pool = [
            { id: "hunt", desc: "Hunt 5 demons in the woods", target: 5 },
            { id: "battle", desc: "Engage in 10 training battles", target: 10 },
            { id: "work", desc: "Help Butterfly Mansion 5 times", target: 5 }
        ];
        const t = pool[Math.floor(Math.random() * pool.length)];
        user.active_task = { ...t, progress: 0, completed: false };
    };

    // ==========================================
    // 💮 1. /balance & /bal
    // ==========================================
    bot.onText(/\/(?:balance|bal)/, (msg) => {
        const userId = msg.from.id.toString();
        let db = ensureUser(userId);
        let p = db[userId];

        let totalSerums = 0;
        let totalOres = parseInt(p.materials["universal_blessing"]) || 0;
        if (isNaN(totalOres)) totalOres = 0;
        
        Object.keys(p.materials).forEach(key => {
            if (key.endsWith('_essence')) {
                let amt = parseInt(p.materials[key]) || 0;
                totalSerums += isNaN(amt) ? 0 : amt;
            }
        });

        const text = `💮 **SLAYER REGISTER | CORPS PASSPORT** 💮\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                     `👤 **User ID:** \`${userId}\`\n` +
                     `📊 **Slayer Rank:** \`Level ${p.level}\` *(XP: ${p.exp})*\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                     `💰 **FINANCIAL LEDGER:**\n` +
                     `🪙 **Crow Coins:** \`${p.coins.toLocaleString()}\`\n` +
                     `💎 **Nichirin Crystals:** \`${p.crystals.toLocaleString()}\`\n` +
                     `✨ **Mythic Tokens:** \`${p.mythic.toLocaleString()}\`\n\n` +
                     `📦 **VAULT INVENTORY:**\n` +
                     `🧪 **Specific Essences:** \`${totalSerums}\` units\n` +
                     `⚔️ **Universal Blessings:** \`${totalOres}\` / 3 pieces\n\n` +
                     `📖 *Usage:* \`/use <character>_essence\`\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
    });

    // ==========================================
    // 🦅 2. /task
    // ==========================================
    bot.onText(/\/task/, (msg) => {
        const userId = msg.from.id.toString();
        let db = ensureUser(userId);
        let p = db[userId];
        const today = new Date().toISOString().split('T')[0];

        if (!p.active_task || p.last_daily !== today) {
            assignTask(p);
            p.last_daily = today;
            saveDB(db);
        }

        const t = p.active_task;
        const status = t.completed ? "🟢 SUCCESS (Claimed)" : "🚨 ACTIVE (In Progress)";
        const text = `🦅 **KASUGAI CROW | DAILY DIRECTIVE** 🦅\n` +
                     `*“CAW! New orders from headquarters! CAW!”*\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                     `📜 **MISSION:** \`${t.desc}\`\n` +
                     `📡 **STATUS:** ${status}\n` +
                     `📊 **TRACKING:** \`[ ${t.progress} / ${t.target} ]\`\n\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                     `🎁 **COMPLETION REWARDS:**\n` +
                     `✨ \`+20 Mythic Tokens\` | 📈 \`+50 Training XP\``;

        bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
    });

    // ==========================================
    // 🔄 3. /convert
    // ==========================================
    bot.onText(/\/convert (.+) (.+)/, (msg, match) => {
        const userId = msg.from.id.toString();
        let db = ensureUser(userId);
        let p = db[userId];
        const type = match[1].toLowerCase();
        const amount = parseInt(match[2], 10);

        if (isNaN(amount) || amount <= 0) {
            return bot.sendMessage(msg.chat.id, "❌ **Forger Error:** Invalid trade value params.");
        }

        if (type === "c2cr") { 
            const cost = amount * 100;
            if (p.coins < cost) return bot.sendMessage(msg.chat.id, `❌ Not enough Crow Coins. Need 🪙 ${cost.toLocaleString()}`);
            p.coins -= cost;
            p.crystals += amount;
            bot.sendMessage(msg.chat.id, `🔄 **TRADE SUCCESSFUL** 🔄\n━━━━━━━━━━━━━━━━━━━━\nSpent: 🪙 \`${cost.toLocaleString()} Coins\`\nObtained: 💎 \`${amount.toLocaleString()} Nichirin Crystals\`\n━━━━━━━━━━━━━━━━━━━━`);
        } else if (type === "cr2mt") { 
            const cost = amount * 100;
            if (p.crystals < cost) return bot.sendMessage(msg.chat.id, `❌ Not enough Crystals. Need 💎 ${cost.toLocaleString()}`);
            p.crystals -= cost;
            p.mythic += amount;
            bot.sendMessage(msg.chat.id, `🔄 **TRADE SUCCESSFUL** 🔄\n━━━━━━━━━━━━━━━━━━━━\nSpent: 💎 \`${cost.toLocaleString()} Crystals\`\nObtained: ✨ \`${amount.toLocaleString()} Mythic Tokens\`\n━━━━━━━━━━━━━━━━━━━━`);
        } else {
            return bot.sendMessage(msg.chat.id, "❌ **Invalid Trade Route!** Use \`c2cr\` (Coins to Crystals) or \`cr2mt\` (Crystals to Tokens).");
        }
        saveDB(db);
    });

    // ==========================================
    // 🏮 4. /spin (ADVANCED MULTI-TIER ENGINE)
    // ==========================================
    bot.onText(/\/spin\s*(\w*)\s*(\d*)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();
        
        let db = getDB();
        db[userId] = sanitizeUserObject(db[userId]);
        let p = db[userId];

        const mode = match[1] ? match[1].toLowerCase() : "normal";
        const count = match[2] ? parseInt(match[2], 10) : 1;

        let cost = 0;
        let rolls = count;
        let currencyKey = "";
        let assetSymbol = "";

        if (mode === "normal") {
            currencyKey = "coins";
            assetSymbol = "🪙";
            if (count === 1) cost = 25;
            else if (count === 5) cost = 250;
            else if (count === 10) { cost = 500; rolls = 11; } 
            else if (count === 50) cost = 2500;
            else return bot.sendMessage(chatId, "❌ **Invalid Multi-Spin count!** Options: 1, 5, 10, 50.");
        } 
        else if (mode === "character") {
            currencyKey = "mythic";
            assetSymbol = "✨";
            if (count === 1) cost = 1500;
            else if (count === 5) cost = 7500;
            else return bot.sendMessage(chatId, "❌ **Character spin bundles are limited to 1x or 5x spins only!**");
        } 
        else if (mode === "material") {
            currencyKey = "crystals";
            assetSymbol = "💎";
            if (count === 1) cost = 50;
            else if (count === 5) cost = 250;
            else if (count === 10) { cost = 500; rolls = 11; } 
            else if (count === 50) cost = 2500;
            else return bot.sendMessage(chatId, "❌ **Invalid Material compilation parameters!** Options: 1, 5, 10, 50.");
        } else {
            return bot.sendMessage(chatId, "❌ **Unknown Tier selection!** Use `/spin normal`, `/spin character`, or `/spin material` followed by count.");
        }

        if (p[currencyKey] < cost) {
            return bot.sendMessage(chatId, `❌ **Sack Depleted!** Need ${assetSymbol} \`${cost.toLocaleString()}\` for this operation.`);
        }

        let lootEarned = [];
        const normalNames = Array.isArray(normalCards) ? normalCards.map(c => c.name) : Object.keys(normalCards || {});
        const mythicObjects = Array.isArray(mythicCards) ? mythicCards : [];

        for (let i = 0; i < rolls; i++) {
            if (mode === "normal") {
                if (Math.random() < 0.70) {
                    const randomNorm = normalNames[Math.floor(Math.random() * normalNames.length)] || "Corps Recruit";
                    p.inventory.push(randomNorm);
                    lootEarned.push(`🃏 Card: ${randomNorm}`);
                } else {
                    const bonusCoins = Math.floor(Math.random() * 80) + 20;
                    p.coins = (parseInt(p.coins) || 0) + bonusCoins;
                    lootEarned.push(`🪙 Bonus: +${bonusCoins} Coins`);
                }
            } 
            else if (mode === "character") {
                const randChance = Math.random() * 100;
                if (randChance < 3.0 && mythicObjects.length > 0) { 
                    const muzan = mythicObjects.find(c => c.id.includes("muzan")) || mythicObjects[mythicObjects.length - 1];
                    p.inventory.push(muzan.name);
                    lootEarned.push(`🔥 [MYTHICAL ULTIMATE] ${muzan.name}`);
                } else if (randChance < 15.0 && mythicObjects.length > 0) {
                    const luckyMythic = mythicObjects[Math.floor(Math.random() * mythicObjects.length)];
                    p.inventory.push(luckyMythic.name);
                    lootEarned.push(`✨ [MYTHICAL LIMITED] ${luckyMythic.name}`);
                } else {
                    const normalFallback = normalNames[Math.floor(Math.random() * normalNames.length)] || "Elite Recruit";
                    p.inventory.push(normalFallback);
                    lootEarned.push(`🃏 Normal Card: ${normalFallback}`);
                }
            } 
            else if (mode === "material") {
                if (Math.random() < 0.15) {
                    let curBless = parseInt(p.materials["universal_blessing"]) || 0;
                    p.materials["universal_blessing"] = curBless + 1;
                    lootEarned.push("💎 Universal Blessing Ore Piece");
                } else {
                    const poolSample = mythicObjects.length > 0 ? mythicObjects.map(c => c.id.split('_')[0]) : ["tanjiro", "nezuko", "zenitsu"];
                    const designatedChar = poolSample[Math.floor(Math.random() * poolSample.length)];
                    const generatedEssence = `${designatedChar}_essence`;
                    
                    let curEss = parseInt(p.materials[generatedEssence]) || 0;
                    p.materials[generatedEssence] = curEss + 1;
                    lootEarned.push(`🧪 Essence: ${generatedEssence.toUpperCase()}`);
                }
            }
        }

        p[currencyKey] = (parseInt(p[currencyKey]) || 0) - cost;
        db[userId] = sanitizeUserObject(p); // Re-verification hard lock block before saving
        saveDB(db);

        const processingMsg = await bot.sendMessage(chatId, `🎰 **NICHIRIN FORGE SLOTS | MODE: ${mode.toUpperCase()}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔄 Bellows roaring, finalizing matrix configurations...\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎟️ \`Deducted:\` ${assetSymbol} ${cost.toLocaleString()}`);

        const reportSummary = lootEarned.map(item => `• ${item}`).join('\n');
        let finalOutput = `🎰 **FORGE DROP REPORT | PROCESS COMPLETION**\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `🎁 **EXTRACTED REWARDS (${rolls}x Processing):**\n${reportSummary}\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `BANK STORAGE SAVED STATUS: ✅ SECURE\n` +
                          `• Coins: \`${p.coins.toLocaleString()}\` | Crystals: \`${p.crystals}\` | Tokens: \`${p.mythic}\``;

        await bot.editMessageText(finalOutput, {
            chat_id: chatId,
            message_id: processingMsg.message_id,
            parse_mode: "Markdown"
        }).catch(() => {});
    });

    // ==========================================
    // 🧪 5. /use (INTELLIGENT SELECTION ARCHETYPE)
    // ==========================================
    bot.onText(/\/use\s*(.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();
        let db = ensureUser(userId);
        const itemRequested = match[1].trim().toLowerCase();

        if (!db[userId].materials[itemRequested] || parseInt(db[userId].materials[itemRequested]) < 1) {
            return bot.sendMessage(chatId, `❌ **Vault Discrepancy!** You don't possess any units of \`${itemRequested}\` inside storage blueprints.`);
        }

        if (!itemRequested.endsWith('_essence')) {
            return bot.sendMessage(chatId, "❌ **Execution Halted:** `/use` pipeline accepts character-specific essences only!");
        }

        const characterReference = itemRequested.split('_')[0]; 

        const interfaceOptions = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        { text: "🟢 Normal Form Upgrade", callback_data: `use_essence:${characterReference}:${itemRequested}:normal` },
                        { text: "🔴 Mythical Form Upgrade", callback_data: `use_essence:${characterReference}:${itemRequested}:mythical` }
                    ]
                ]
            }),
            parse_mode: "Markdown"
        };

        bot.sendMessage(chatId, `🧪 **ESSENCE EXTRACTION DEPLOYMENT ENGINE**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\nDetected: \`${itemRequested.toUpperCase()}\` blueprint item.\n\nChoose target matrix formulation platform below:`, interfaceOptions);
    });

    // Inline Button Processing Callbacks Matrix Interceptor
    bot.on("callback_query", async (query) => {
        const dataPayload = query.data;
        if (!dataPayload.startsWith("use_essence:")) return;

        const [_, charRef, targetEssence, chosenTier] = dataPayload.split(":");
        const userId = query.from.id.toString();
        const chatId = query.message.chat.id;

        let db = getDB();
        db[userId] = sanitizeUserObject(db[userId]);
        let p = db[userId];

        let essenceCount = parseInt(p.materials[targetEssence]) || 0;
        if (essenceCount < 1) {
            return bot.answerCallbackQuery(query.id, { text: "Bhai, item nahi mil raha vault mein!", show_alert: true });
        }

        let ownedInventoryIndex = p.inventory.findIndex(item => {
            if (typeof item === "string") return item.toLowerCase().includes(charRef);
            return item.name && item.name.toLowerCase().includes(charRef);
        });
        
        if (ownedInventoryIndex === -1) {
            return bot.answerCallbackQuery(query.id, { text: `Bhai, pehle ${charRef.toUpperCase()} ka card acquire karo inventory mein!`, show_alert: true });
        }

        p.materials[targetEssence] = essenceCount - 1;
        if (p.materials[targetEssence] <= 0) delete p.materials[targetEssence];

        let gainedXp = chosenTier === "mythical" ? 50 : 100; 
        let gainedPower = chosenTier === "mythical" ? 150 : 50;
        let boundaryXpCap = chosenTier === "mythical" ? 500 : 100;

        if (typeof p.inventory[ownedInventoryIndex] === "string") {
            p.inventory[ownedInventoryIndex] = {
                name: p.inventory[ownedInventoryIndex],
                level: 1,
                xp: 0,
                power: chosenTier === "mythical" ? 7000 : 1200
            };
        }

        let card = p.inventory[ownedInventoryIndex];
        card.level = isNaN(parseInt(card.level)) ? 1 : parseInt(card.level);
        card.xp = isNaN(parseInt(card.xp)) ? 0 : parseInt(card.xp);
        card.power = isNaN(parseInt(card.power)) ? 1000 : parseInt(card.power);

        card.xp += gainedXp;
        card.power += gainedPower;

        let leveledUp = false;
        if (card.xp >= boundaryXpCap) {
            card.xp -= boundaryXpCap;
            card.level += 1;
            card.power += chosenTier === "mythical" ? 300 : 75; 
            leveledUp = true;
        }

        db[userId] = sanitizeUserObject(p);
        saveDB(db);
        await bot.answerCallbackQuery(query.id, { text: "Cultivation sequence processed and saved safely!" });

        let reportMessage = `🧪 **ESSENCE PROCESSING SEQUENCE COMPLETION**\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `✅ Target item consumed: \`${targetEssence.toUpperCase()}\`\n` +
                            `🎯 Target profile type: \`${chosenTier.toUpperCase()} Format\`\n\n` +
                            `📈 **STATISTICAL MODIFICATIONS ADJUSTMENT:**\n` +
                            `• Raw Combat Power: \`+${gainedPower}\` *(Total: ${card.power})*\n` +
                            `• Synthesized Base XP: \`+${gainedXp}\` *(${card.xp}/${boundaryXpCap})*\n`;

        if (leveledUp) {
            reportMessage += `\n🎉 **ASCENSION DETECTED!** Card advanced smoothly up to **Level ${card.level}**!`;
        }
        reportMessage += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        bot.editMessageText(reportMessage, {
            chat_id: chatId,
            message_id: query.message.message_id,
            parse_mode: "Markdown"
        }).catch(() => {});
    });

    // ==========================================
    // 💼 6. /work
    // ==========================================
    bot.onText(/\/work/, (msg) => {
        const userId = msg.from.id.toString();
        let db = ensureUser(userId);
        let p = db[userId];
        
        const earnings = 200;
        p.coins = (parseInt(p.coins) || 0) + earnings;
        
        if (p.active_task && p.active_task.id === "work" && !p.active_task.completed) {
            p.active_task.progress = (parseInt(p.active_task.progress) || 0) + 1;
            if (p.active_task.progress >= p.active_task.target) {
                p.active_task.completed = true;
                p.mythic = (parseInt(p.mythic) || 0) + 20; 
                p.exp = (parseInt(p.exp) || 0) + 50;
                bot.sendMessage(msg.chat.id, "🦅 *“CAW! Mission Complete!”* — Added \`+20 Mythic Tokens\` & \`+50 Training XP\`!");
            }
        }
        
        saveDB(db);
        bot.sendMessage(msg.chat.id, `💼 **Patrol Complete!** Helped the village and earned \`${earnings} Crow Coins\`.`);
    });
};
