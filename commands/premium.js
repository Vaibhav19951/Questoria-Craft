const { Markup } = require('telegraf');
const godChars = require('./asset/godchar');
const ADMIN_ID = '2086993762'; // Replace with your numeric Telegram ID

const premium = (bot) => {
    
    // 1. Premium Shop Menu
    bot.command('premium', (ctx) => {
        const premiumMenu = `
💎 **GOD SLAYER PREMIUM STORE** 💎
━━━━━━━━━━━━━━━━━━━━━
✨ **ESSENCE & BLESSINGS**
• 🔸 *Tanjiro's Essence*: 500 Coins
• 💧 *Water Breathing Blessing*: 1200 Coins
• 🔥 *Sun Breathing Blessing*: 2500 Coins

👑 **GOD-TIER LEGENDARY CARDS**
*(Manual Approval System)*
━━━━━━━━━━━━━━━━━━━━━
⚔️ *Yoriichi Tsugikuni* | ₹499
👹 *Muzan Kibutsuji* | ₹399
🌙 *Kokushibo* | ₹199

*Choose your card to proceed:*`;

        ctx.reply(premiumMenu, Markup.inlineKeyboard([
            [Markup.button.callback('✨ Essence/Blessings', 'shop_essence')],
            [
                Markup.button.callback('⚔️ Buy Yoriichi', 'buy_yoriichi_godtier'),
                Markup.button.callback('👹 Buy Muzan', 'buy_muzan_godtier')
            ],
            [Markup.button.callback('🌙 Buy Kokushibo', 'buy_kokushibo_godtier')]
        ]));
    });

    // 2. Initial Selection & Proceed to Payment Button
    bot.action(/buy_(.+)/, (ctx) => {
        const charId = ctx.match[1];
        const char = godChars[charId];
        
        ctx.reply(`🔥 *Selected:* ${char.name}\n💰 *Price:* ₹${char.cost}\n\nClick the button below to view the QR code and complete your payment.`, 
        Markup.inlineKeyboard([
            [Markup.button.callback('💳 Proceed to Payment (Show QR)', `show_qr_${charId}`)]
        ]));
    });

    // 3. Show QR Code
    bot.action(/show_qr_(.+)/, (ctx) => {
        ctx.replyWithPhoto('https://image-link.edgeone.app/1779687803104-dh71y4.jpg', {
            caption: "📸 *Scan this QR to pay.*\nAfter payment, send the screenshot and UTR number here in the chat to get approved."
        });
    });

    // 4. Handle Payment Proof (SS) & Notify Owner
    bot.on('photo', async (ctx) => {
        const photoId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const userId = ctx.from.id;
        const userName = ctx.from.username || ctx.from.first_name;

        await bot.telegram.sendPhoto(ADMIN_ID, photoId, {
            caption: `🚨 *New Payment Request*\nUser: @${userName}\nID: ${userId}\n\n*Action Required:*`,
            ...Markup.inlineKeyboard([
                [
                    Markup.button.callback('✅ Approve', `approve_${userId}_yoriichi_godtier`), // Adjust charID dynamically if needed
                    Markup.button.callback('❌ Reject', `reject_${userId}`)
                ]
            ])
        });
        
        ctx.reply("✅ Proof submitted! Admin will verify your payment shortly.");
    });

    // 5. Approval Logic
    bot.action(/approve_(.+)_(.+)/, async (ctx) => {
        const [_, userId, charId] = ctx.match;
        const charData = godChars[charId];

        await db.collection('users').updateOne(
            { user_id: parseInt(userId) },
            { $push: { owned_characters: { ...charData, id: charId } } }
        );

        await bot.telegram.sendMessage(userId, `🎉 *Congratulations!*\n${charData.name} has been added to your inventory.`);
        ctx.editMessageCaption(`✅ Approved! ${charData.name} added to ${userId}.`);
    });

    // 6. Reject Logic
    bot.action(/reject_(.+)/, async (ctx) => {
        const userId = ctx.match[1];
        await bot.telegram.sendMessage(userId, "❌ Your payment was rejected. Please contact support if this is a mistake.");
        ctx.editMessageCaption("❌ Payment Rejected.");
    });
};

module.exports = premium;
