// ==========================================
// ⚔️ AUTOMATED CORPS BATTLE SYSTEM (battle.js)
// ==========================================

// Demon Pool Configuration
const demonPool = [
    { name: "Hand Demon", hp: 300, attack: 25, rewardCoins: 120, rewardTokens: 0 },
    { name: "Rui (Lower Moon 5)", hp: 600, attack: 45, rewardCoins: 300, rewardTokens: 5 },
    { name: "Akaza (Upper Moon 3)", hp: 1500, attack: 85, rewardCoins: 800, rewardTokens: 25 },
    { name: "Kokushibo (Upper Moon 1)", hp: 2500, attack: 120, rewardCoins: 1500, rewardTokens: 50 }
];

// Active global battles tracking registry
const activeBattles = new Map();

module.exports = (bot) => {

    bot.onText(/\/battle/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();

        // Safe Core Shield Verification
        if (!global.economyDB) {
            return bot.sendMessage(chatId, "🚨 **System Error:** Economy database engine core not detected. Please restart the bot.");
        }

        let db = global.economyDB.getDB();
        db[userId] = global.economyDB.sanitizeUserObject(db[userId]);
        let p = db[userId];

        if (activeBattles.has(userId)) {
            return bot.sendMessage(chatId, "⚔️ **Combat Lock!** You are already engaged in a mortal struggle. Finish that encounter first!");
        }

        // Randomly pull a demon from the generator pool
        const demon = { ...demonPool[Math.floor(Math.random() * demonPool.length)] };
        
        // Calculate player combat stats based on inventory size / level matrix
        let basePlayerHp = 500;
        let basePlayerAtk = 40;

        // Active tracking session blueprint
        const session = {
            playerHp: basePlayerHp,
            playerMaxHp: basePlayerHp,
            playerAtk: basePlayerAtk,
            demonName: demon.name,
            demonHp: demon.hp,
            demonMaxHp: demon.hp,
            demonAtk: demon.attack,
            rewardCoins: demon.rewardCoins,
            rewardTokens: demon.rewardTokens,
            messageId: null
        };

        activeBattles.set(userId, session);

        const battleInterface = {
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [
                        { text: "⚔️ Attack", callback_data: `slay_attack:${userId}` },
                        { text: "🛡️ Defend", callback_data: `slay_defend:${userId}` }
                    ],
                    [
                        { text: "🏃 Flee", callback_data: `slay_flee:${userId}` }
                    ]
                ]
            }),
            parse_mode: "Markdown"
        };

        bot.sendMessage(chatId, 
            `👹 **DEMON ENGCOUNTER | ENEMY SPOTTED**\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `A wild **${demon.name}** has broken through the perimeter lines!\n\n` +
            `❤️ **Your HP:** \`${session.playerHp}/${session.playerMaxHp}\` | ⚔️ **Atk:** \`${session.playerAtk}\`\n` +
            `🖤 **Demon HP:** \`${session.demonHp}/${session.demonMaxHp}\` | 💢 **Atk:** \`${session.demonAtk}\`\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Choose your active breathing form form style combat action:`, 
            battleInterface
        ).then((sentMsg) => {
            session.messageId = sentMsg.message_id;
        });
    });

    // ==========================================
    // 🎛️ BATTLE ENCOUNTER ACTION INTERCEPTOR
    // ==========================================
    bot.on("callback_query", async (query) => {
        const chatId = query.message.chat.id;
        const callerId = query.from.id.toString();
        const dataPayload = query.data;

        // 🔥 SHIELD: Agar battle button nahi hai, toh economy/spin ko bypass karne do!
        if (!dataPayload.startsWith("slay_attack:") && !dataPayload.startsWith("slay_defend:") && !dataPayload.startsWith("slay_flee:")) {
            return; 
        }

        const chunks = dataPayload.split(":");
        const targetUserId = chunks[1];

        // Anti-hijacking security verification lock
        if (targetUserId !== callerId) {
            return bot.answerCallbackQuery(query.id, {
                text: "❌ This is not your battle arena! Run /battle to spawn your own demon.",
                show_alert: true
            });
        }

        const session = activeBattles.get(callerId);
        if (!session) {
            bot.deleteMessage(chatId, query.message.message_id).catch(() => {});
            return bot.answerCallbackQuery(query.id, { text: "⚠️ Battle session has expired or concluded.", show_alert: true });
        }

        let actionLog = "";

        if (dataPayload.startsWith("slay_attack:")) {
            // Player deals damage
            let pDmg = Math.floor(Math.random() * 20) + session.playerAtk;
            session.demonHp -= pDmg;
            actionLog += `⚔️ You executed a breathing form dealing **💥 ${pDmg}** damage!\n`;

            if (session.demonHp <= 0) {
                // Demon defeated victory sequence
                activeBattles.delete(callerId);
                
                let db = global.economyDB.getDB();
                db[callerId] = global.economyDB.sanitizeUserObject(db[callerId]);
                
                db[callerId].coins += session.rewardCoins;
                db[callerId].mythic += session.rewardTokens; // giving tokens as mythic asset
                
                global.economyDB.saveDB(db);

                await bot.editMessageText(
                    `🏆 **VICTORY REPORT | MISSION SUCCESS**\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `You successfully decapitated **${session.demonName}**!\n\n` +
                    `💰 **Rewards Recovered:**\n` +
                    `• 🪙 +${session.rewardCoins} Crow Coins\n` +
                    `• ✨ +${session.rewardTokens} Mythic Tokens\n` +
                    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                    `Status: Safe perimeter established. Account balances synced.`,
                    { chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown" }
                ).catch(() => {});
                
                return bot.answerCallbackQuery(query.id);
            }

            // Demon counter attacks if alive
            let dDmg = Math.floor(Math.random() * 15) + (session.demonAtk - 10);
            dDmg = Math.max(5, dDmg);
            session.playerHp -= dDmg;
            actionLog += `👹 **${session.demonName}** retaliated dealing **💔 ${dDmg}** damage to you!\n`;
        }

        if (dataPayload.startsWith("slay_defend:")) {
            // Defend minimizes incoming damage and heals a fraction
            let heal = Math.floor(Math.random() * 15) + 10;
            session.playerHp = Math.min(session.playerMaxHp, session.playerHp + heal);
            
            let dDmg = Math.floor(Math.random() * 10) + 5; // Heavily mitigated damage
            session.playerHp -= dDmg;

            actionLog += `🛡️ You took a defensive posture, bracing for impact! (+❤️ ${heal} HP)\n`;
            actionLog += `👹 Enemy strike mitigated! You took only **💔 ${dDmg}** damage.\n`;
        }

        if (dataPayload.startsWith("slay_flee:")) {
            activeBattles.delete(callerId);
            bot.deleteMessage(chatId, query.message.message_id).catch(() => {});
            bot.sendMessage(chatId, `🏃 You threw a smoke bomb and successfully escaped from **${session.demonName}**!`);
            return bot.answerCallbackQuery(query.id);
        }

        // Check Defeat status conditions
        if (session.playerHp <= 0) {
            activeBattles.delete(callerId);
            await bot.editMessageText(
                `💀 **DIED IN BATTLE | MISSION FAILED**\n` +
                `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                `You were completely overpowered by **${session.demonName}** and collapsed on the battlefield.\n\n` +
                `🚑 Kakushi recovery teams managed to drag your body back to the Butterfly Mansion. You lost no assets but need rest.`,
                { chat_id: chatId, message_id: query.message.message_id, parse_mode: "Markdown" }
            ).catch(() => {});
            
            return bot.answerCallbackQuery(query.id);
        }

        // Update main rendering frame if both fighters are still standing
        const updatedInterface = {
            inline_keyboard: [
                [
                    { text: "⚔️ Attack", callback_data: `slay_attack:${callerId}` },
                    { text: "🛡️ Defend", callback_data: `slay_defend:${callerId}` }
                ],
                [
                    { text: "🏃 Flee", callback_data: `slay_flee:${callerId}` }
                ]
            ]
        };

        await bot.editMessageText(
            `⚔️ **COMBAT ENCOUNTER IN PROGRESS**\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${actionLog}` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `❤️ **Your HP:** \`${session.playerHp}/${session.playerMaxHp}\`\n` +
            `🖤 **${session.demonName} HP:** \`${session.demonHp}/${session.demonMaxHp}\`\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `Maintain concentration! Choose your next move:`,
            {
                chat_id: chatId,
                message_id: query.message.message_id,
                reply_markup: JSON.stringify(updatedInterface),
                parse_mode: "Markdown"
            }
        ).catch(() => {});

        return bot.answerCallbackQuery(query.id);
    });
};
