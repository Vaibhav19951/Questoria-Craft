console.log("💰 VELIX OS | DEMON SLAYER ECONOMY ENGINE [UI v2.7 - ONLINE]");

const fs = require("fs");
const path = require("path");
const playerFile = path.join(process.cwd(), "data", "players.json");

// Dynamic items allocation base pool from core asset blocks
const { characters: normalCards } = require("../asset/assets.js");
const { mythical: mythicCards } = require("../asset/mythical.js");

const getDB = () => {
    try {
        if (!fs.existsSync(playerFile)) return {};
        return JSON.parse(fs.readFileSync(playerFile, "utf8"));
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

    const ensureUser = (userId) => {
        let db = getDB();
        if (!db[userId]) {
            db[userId] = { 
                coins: 500, crystals: 0, mythic: 0, exp: 0, level: 1, 
                last_daily: "", active_task: null,
                inventory: [],
                materials: [] 
            };
            saveDB(db);
        } else {
            if (!db[userId].materials) db[userId].materials = [];
            if (!db[userId].inventory) db[userId].inventory = [];
        }
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
    // 💮 1. /balance & /bal (SLAYER CORPS PROFILE)
    // ==========================================
    bot.onText(/\/(?:balance|bal)/, (msg) => {
        const userId = msg.from.id.toString();
        let db = ensureUser(userId);
        let p = db[userId];

        const totalSerums = p.materials.filter(m => m.endsWith('_essence')).length;
        const totalOres = p.materials.filter(m => m.endsWith('_blessing')).length;

        const text = `💮 **SLAYER REGISTER | CORPS PASSPORT** 💮\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                     `👤 **User ID:** \`${userId}\`\n` +
                     `📊 **Slayer Rank:** \`Level ${p.level}\` *(XP: ${p.exp})*\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                     `💰 **FINANCIAL LEDGER:**\n` +
                     `🪙 **Crow Coins:** \`${Number(p.coins).toLocaleString()}\`\n` +
                     `💎 **Nichirin Crystals:** \`${Number(p.crystals).toLocaleString()}\`\n` +
                     `✨ **Mythic Essence:** \`${Number(p.mythic).toLocaleString()}\`\n\n` +
                     `📦 **VAULT INVENTORY:**\n` +
                     `🧪 **Wisteria Serums:** \`${totalSerums}\` units\n` +
                     `⚔️ **Nichirin Ores:** \`${totalOres}\` pieces\n\n` +
                     `📖 *Check items:* \`/essence <name>\` or \`/blessing <name>\`\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━`;

        bot.sendMessage(msg.chat.id, text, { parse_mode: "Markdown" });
    });

    // ==========================================
    // 🦅 2. /task (KASUGAI CROW DIRECTIVE)
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
    // 🔄 3. /convert (CURRENCY EXCHANGER)
    // ==========================================
    bot.onText(/\/convert (.+) (.+)/, (msg, match) => {
        const userId = msg.from.id.toString();
        let db = ensureUser(userId);
        const type = match[1].toLowerCase();
        const amount = parseInt(match[2], 10);

        if (isNaN(amount) || amount <= 0) {
            return bot.sendMessage(msg.chat.id, "❌ **Forger Error:** Invalid trade value params.");
        }

        if (type === "c2cr") { 
            const cost = amount * 100;
            if (db[userId].coins < cost) return bot.sendMessage(msg.chat.id, `❌ Not enough Crow Coins. Need 🪙 ${cost.toLocaleString()}`);
            db[userId].coins -= cost;
            db[userId].crystals += amount;
            bot.sendMessage(msg.chat.id, `🔄 **TRADE SUCCESSFUL** 🔄\n━━━━━━━━━━━━━━━━━━━━\nSpent: 🪙 \`${cost.toLocaleString()} Coins\`\nObtained: 💎 \`${amount.toLocaleString()} Nichirin Crystals\`\n━━━━━━━━━━━━━━━━━━━━`);
        } else if (type === "cr2mt") { 
            const cost = amount * 100;
            if (db[userId].crystals < cost) return bot.sendMessage(msg.chat.id, `❌ Not enough Crystals. Need 💎 ${cost.toLocaleString()}`);
            db[userId].crystals -= cost;
            db[userId].mythic += amount;
            bot.sendMessage(msg.chat.id, `🔄 **TRADE SUCCESSFUL** 🔄\n━━━━━━━━━━━━━━━━━━━━\nSpent: 💎 \`${cost.toLocaleString()} Crystals\`\nObtained: ✨ \`${amount.toLocaleString()} Mythic Tokens\`\n━━━━━━━━━━━━━━━━━━━━`);
        } else {
            bot.sendMessage(msg.chat.id, "❌ **Invalid Trade Route!** Use \`c2cr\` (Coins to Crystals) or \`cr2mt\` (Crystals to Tokens).");
        }
        saveDB(db);
    });

    // ==========================================
    // 🏮 4. /spin (NICHIRIN FORGE SLOTS)
    // ==========================================
    bot.onText(/\/spin/, async (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();
        let db = ensureUser(userId);
        let p = db[userId];

        const COIN_COST = 1200;
        const TOKEN_COST = 5;
        let paymentMethod = "";

        if (p.coins >= COIN_COST) {
            p.coins -= COIN_COST;
            paymentMethod = `🪙 -${COIN_COST} Crow Coins`;
        } else if (p.mythic >= TOKEN_COST) {
            p.mythic -= TOKEN_COST;
            paymentMethod = `✨ -${TOKEN_COST} Mythic Tokens`;
        } else {
            return bot.sendMessage(chatId, `❌ **Forge Frozen!**\n\nNeed 🪙 ${COIN_COST} Coins or ✨ ${TOKEN_COST} Tokens to trigger bellows!`, { parse_mode: "Markdown" });
        }

        saveDB(db);

        const rollingMsg = await bot.sendMessage(chatId, `🎰 **🎰 NICHIRIN FORGE SLOTS 🎰**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔄 [ 🟦 | 🟦 | 🟦 ] *Bellows expanding...*\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎟️ \`Fee:\` ${paymentMethod}`);

        const matrixFrames = [
            `🎰 **🎰 NICHIRIN FORGE SLOTS 🎰**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔄 [ 🧪 | ⚔️ | 🪙 ] *Heating steels...*\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎟️ \`Fee:\` ${paymentMethod}`,
            `🎰 **🎰 NICHIRIN FORGE SLOTS 🎰**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔄 [ 💎 | 💎 | 🧪 ] *Sparks cascading...*\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎟️ \`Fee:\` ${paymentMethod}`,
            `🎰 **🎰 NICHIRIN FORGE SLOTS 🎰**\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔄 [ ⚔️ | 👑 | 💎 ] *Tempering sword cores...*\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n🎟️ \`Fee:\` ${paymentMethod}`
        ];

        for (let i = 0; i < matrixFrames.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 750));
            await bot.editMessageText(matrixFrames[i], {
                chat_id: chatId,
                message_id: rollingMsg.message_id,
                parse_mode: "Markdown"
            }).catch(() => {});
        }

        const rollValue = Math.random() * 100;
        let slotDisplay = "";
        let rewardTitle = "";
        let rewardText = "";

        if (rollValue < 2) { 
            const amt = 25;
            p.mythic = Number(p.mythic || 0) + amt;
            slotDisplay = "👑 | 👑 | 👑";
            rewardTitle = "✨ MYTHICAL JACKPOT EXTRACTION ✨";
            rewardText = `🎉 Absolute Fortune! Salvaged **${amt} Mythic Tokens** directly from the inner forge channel!`;
        } 
        else if (rollValue < 12) { 
            const amt = 12;
            p.crystals = Number(p.crystals || 0) + amt;
            slotDisplay = "💎 | 💎 | 💎";
            rewardTitle = "💎 CRYSTAL MATRIX DROP 💎";
            rewardText = `🎁 Sparking raw matrices! Handed over **${amt} Nichirin Crystals** to your pack.`;
        } 
        else if (rollValue < 40) { 
            const amt = 3000;
            p.coins += amt;
            slotDisplay = "🪙 | 🪙 | 🧪";
            rewardTitle = "🪙 MASSIVE COINS RETURN 🪙";
            rewardText = `💵 The merchant syndicate re-route! Recovered **${amt.toLocaleString()} Crow Coins**.`;
        } 
        else if (rollValue < 75) { 
            const normalKeys = Object.keys(normalCards || {});
            const mythicKeys = Object.keys(mythicCards || {});
            const combinedKeys = [...new Set([...normalKeys, ...mythicKeys])];
            const randomChar = combinedKeys[Math.floor(Math.random() * combinedKeys.length)] || "tanjiro";

            if (Math.random() < 0.6) {
                const rType = Math.random() < 0.25 ? "mythic" : "normal";
                const itemId = `${randomChar}_${rType}_essence`;
                p.materials.push(itemId);
                
                slotDisplay = "🧪 | 🧪 | 📦";
                rewardTitle = "🧪 INVENTORY: WISTERIA FLUIDS 🧪";
                rewardText = `Extracted custom **${randomChar.toUpperCase()} [${rType.toUpperCase()}] Wisteria Serum**! Ready for cell cultivation via \`/essence ${randomChar}\`.`;
            } else {
                const rType = Math.random() < 0.25 ? "mythic" : "normal";
                const itemId = `${randomChar}_${rType}_blessing`;
                p.materials.push(itemId);

                slotDisplay = "⚔️ | ⚔️ | 📦";
                rewardTitle = "⚔️ FORGE: UNBOUND NICHIRIN ORE ⚔️";
                rewardText = `Hammered out a matching **${randomChar.toUpperCase()} [${rType.toUpperCase()}] Nichirin Ore** piece! Store block locked. Forge via \`/blessing ${randomChar}\`.`;
            }
        }
        else { 
            slotDisplay = "💀 | ❌ | 🪵";
            rewardTitle = "💥 METALLIC COLLAPSE 💥";
            rewardText = "Slag carbon content too high! Bellows dropped cold ash parameters.";
        }

        saveDB(db);

        let finalLayout = `🎰 **🎰 NICHIRIN FORGE SLOTS 🎰**\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `🏮 [  ${slotDisplay}  ] 🏮\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                          `🔥 **🔴 FORGE REACTION:**\n` +
                          `⚔️ **${rewardTitle}**\n` +
                          `📝 *${rewardText}*\n\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                          `🏦 **UPDATED SACK STORAGE:**\n` +
                          `• 🪙 Coins: \`${p.coins.toLocaleString()}\`\n` +
                          `• 💎 Crystals: \`${Number(p.crystals).toLocaleString()}\`\n` +
                          `• ✨ Tokens: \`${Number(p.mythic).toLocaleString()}\``;

        await bot.editMessageText(finalLayout, {
            chat_id: chatId,
            message_id: rollingMsg.message_id,
            parse_mode: "Markdown"
        }).catch(() => {});
    });

    // ==========================================
    // 💼 5. /work (TRAINING PATROL & CROW REWARD)
    // ==========================================
    bot.onText(/\/work/, (msg) => {
        const userId = msg.from.id.toString();
        let db = ensureUser(userId);
        let p = db[userId];
        
        const earnings = 200;
        p.coins += earnings;
        
        if (p.active_task && p.active_task.id === "work" && !p.active_task.completed) {
            p.active_task.progress += 1;
            if (p.active_task.progress >= p.active_task.target) {
                p.active_task.completed = true;
                p.mythic += 20; p.exp += 50;
                bot.sendMessage(msg.chat.id, "🦅 *“CAW! Mission Complete!”* — Added \`+20 Mythic Tokens\` & \`+50 Training XP\`!");
            }
        }
        
        saveDB(db);
        bot.sendMessage(msg.chat.id, `💼 **Patrol Complete!** Helped the village and earned \`${earnings} Crow Coins\`.`);
    });
};
