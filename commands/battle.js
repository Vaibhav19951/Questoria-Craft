const fs = require("fs");
const path = require("path");

// Fix: Folder ka naam 'asset' hai
const demonData = require(path.join(process.cwd(), "asset", "demon.js"));
const activeBattles = new Map();

module.exports = (bot) => {
    bot.onText(/\/battle/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();

        if (activeBattles.has(userId)) {
            return bot.sendMessage(chatId, "⚔️ **Combat Lock!** Finish your current battle first.");
        }

        const demon = demonData[Math.floor(Math.random() * demonData.length)];
        const session = {
            playerHp: 500, playerMaxHp: 500, playerAtk: 40,
            demonName: demon.name, demonHp: demon.hp, demonMaxHp: demon.hp, demonAtk: demon.attack,
            rewardCoins: demon.rewardCoins, rewardTokens: demon.rewardTokens
        };

        activeBattles.set(userId, session);

        // Fix: 'asset' folder ke andar image path look-up
        const imagePath = path.join(process.cwd(), demon.image);

        if (!fs.existsSync(imagePath)) {
            return bot.sendMessage(chatId, `⚠️ **Image missing at:** \`${demon.image}\``);
        }

        bot.sendPhoto(chatId, imagePath, {
            caption: `👹 **ENCOUNTER: ${demon.name}**\n━━━━━━━━━━━━━━━━━━━━━━━━\n❤️ Your HP: 500 | ⚔️ Atk: 40\n🖤 Demon HP: ${demon.hp} | 💢 Atk: ${demon.attack}`,
            parse_mode: "Markdown",
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: "⚔️ Attack", callback_data: `slay_attack:${userId}` }, { text: "🛡️ Defend", callback_data: `slay_defend:${userId}` }],
                    [{ text: "🏃 Flee", callback_data: `slay_flee:${userId}` }]
                ]
            })
        });
    });

    // Callback logic wahi rahegi
    bot.on("callback_query", async (query) => {
        if (!query.data.startsWith("slay_")) return;

        const [action, targetUserId] = query.data.split(":");
        const callerId = query.from.id.toString();

        if (targetUserId !== callerId) {
            return bot.answerCallbackQuery(query.id, { text: "❌ Not your battle!", show_alert: true });
        }

        const session = activeBattles.get(callerId);
        if (!session) return bot.answerCallbackQuery(query.id, { text: "⚠️ Battle session expired.", show_alert: true });

        let actionLog = "";

        if (action === "slay_attack") {
            let pDmg = Math.floor(Math.random() * 20) + session.playerAtk;
            session.demonHp -= pDmg;
            actionLog += `⚔️ You dealt **💥 ${pDmg}** damage!\n`;

            if (session.demonHp <= 0) {
                activeBattles.delete(callerId);
                let db = global.economyDB.getDB();
                db[callerId].coins += session.rewardCoins;
                db[callerId].mythic += session.rewardTokens;
                global.economyDB.saveDB(db);
                return bot.editMessageCaption(`🏆 **VICTORY!** You defeated ${session.demonName}.`, { chat_id: query.message.chat.id, message_id: query.message.message_id });
            }
            session.playerHp -= Math.max(5, Math.floor(Math.random() * 15) + (session.demonAtk - 10));
        }

        if (action === "slay_defend") {
            session.playerHp = Math.min(session.playerMaxHp, session.playerHp + 15);
            session.playerHp -= Math.floor(Math.random() * 10) + 5;
            actionLog += `🛡️ Defensive stance! Regained HP, mitigated damage.\n`;
        }

        if (action === "slay_flee") {
            activeBattles.delete(callerId);
            return bot.deleteMessage(query.message.chat.id, query.message.message_id);
        }

        if (session.playerHp <= 0) {
            activeBattles.delete(callerId);
            return bot.editMessageCaption(`💀 **DEFEATED.** You were overpowered by ${session.demonName}.`, { chat_id: query.message.chat.id, message_id: query.message.message_id });
        }

        await bot.editMessageCaption(
            `⚔️ **COMBAT IN PROGRESS**\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `${actionLog}\n` +
            `❤️ **Your HP:** \`${session.playerHp}/${session.playerMaxHp}\`\n` +
            `🖤 **${session.demonName} HP:** \`${session.demonHp}/${session.demonMaxHp}\`\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━`,
            {
                chat_id: query.message.chat.id,
                message_id: query.message.message_id,
                parse_mode: "Markdown",
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [{ text: "⚔️ Attack", callback_data: `slay_attack:${callerId}` }, { text: "🛡️ Defend", callback_data: `slay_defend:${callerId}` }],
                        [{ text: "🏃 Flee", callback_data: `slay_flee:${callerId}` }]
                    ]
                })
            }
        ).catch(() => {});

        bot.answerCallbackQuery(query.id);
    });
};
