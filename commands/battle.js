const fs = require("fs");
const path = require("path");

// Demon data load from 'asset' folder
const demonData = require(path.join(process.cwd(), "asset", "demon.js"));
const activeBattles = new Map();

module.exports = (bot) => {
    bot.onText(/\/battle/, (msg) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id.toString();

        if (activeBattles.has(userId)) {
            return bot.sendMessage(chatId, "⚔️ **Combat Lock!** Finish your current battle first.");
        }

        // Random demon from your provided list
        const demon = demonData[Math.floor(Math.random() * demonData.length)];
        
        const session = {
            playerHp: 500, playerMaxHp: 500, playerAtk: 40,
            demonName: demon.name,
            demonHp: demon.hp,
            demonMaxHp: demon.hp,
            demonAtk: demon.attack,
            reward: demon.reward // Reward directly from demon object
        };

        activeBattles.set(userId, session);

        // Sending the image directly from the URL provided in your demon.js
        bot.sendPhoto(chatId, demon.image, {
            caption: `👹 **ENCOUNTER: ${demon.name}**\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                     `❤️ Your HP: \`500/500\` | ⚔️ Atk: \`40\`\n` +
                     `🖤 Demon HP: \`${demon.hp}/${demon.hp}\` | 💢 Atk: \`${demon.attack}\`\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                     `Abilities: ${demon.abilities.join(", ")}`,
            parse_mode: "Markdown",
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: "⚔️ Attack", callback_data: `slay_attack:${userId}` }, { text: "🛡️ Defend", callback_data: `slay_defend:${userId}` }],
                    [{ text: "🏃 Flee", callback_data: `slay_flee:${userId}` }]
                ]
            })
        }).catch(err => {
            bot.sendMessage(chatId, "⚠️ Could not load demon image, but battle is ready!");
        });
    });

    // Callback Query Handler (Same as before)
    bot.on("callback_query", async (query) => {
        if (!query.data.startsWith("slay_")) return;

        const [action, targetUserId] = query.data.split(":");
        const callerId = query.from.id.toString();

        if (targetUserId !== callerId) return bot.answerCallbackQuery(query.id, { text: "❌ Not your battle!", show_alert: true });

        const session = activeBattles.get(callerId);
        if (!session) return bot.answerCallbackQuery(query.id, { text: "⚠️ Battle expired.", show_alert: true });

        if (action === "slay_attack") {
            let pDmg = Math.floor(Math.random() * 20) + session.playerAtk;
            session.demonHp -= pDmg;
            
            if (session.demonHp <= 0) {
                activeBattles.delete(callerId);
                return bot.editMessageCaption(`🏆 **VICTORY!** You defeated ${session.demonName}.`, { 
                    chat_id: query.message.chat.id, message_id: query.message.message_id 
                });
            }
            session.playerHp -= Math.max(5, Math.floor(Math.random() * 15) + (session.demonAtk - 10));
        }

        if (action === "slay_flee") {
            activeBattles.delete(callerId);
            return bot.deleteMessage(query.message.chat.id, query.message.message_id);
        }

        await bot.editMessageCaption(
            `⚔️ **COMBAT IN PROGRESS**\n` +
            `❤️ Your HP: \`${session.playerHp}/${session.playerMaxHp}\`\n` +
            `🖤 ${session.demonName} HP: \`${session.demonHp}/${session.demonMaxHp}\``,
            {
                chat_id: query.message.chat.id, message_id: query.message.message_id,
                parse_mode: "Markdown",
                reply_markup: query.message.reply_markup
            }
        ).catch(() => {});
        
        bot.answerCallbackQuery(query.id);
    });
};
