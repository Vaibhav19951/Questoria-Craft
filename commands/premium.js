const premium = (bot) => {
    const ADMIN_ID = '2086993762'; // Your Owner ID

    // 1. Premium Shop Menu
    bot.onText(/\/premium/, (msg) => {
        const chatId = msg.chat.id;
        const premiumMenu = `
💎 **GOD SLAYER PREMIUM STORE** 💎
━━━━━━━━━━━━━━━━━━━━━
✨ **ESSENCE & BLESSINGS**
• 🔸 Tanjiro's Essence: 500 Coins
• 💧 Water Breathing Blessing: 1200 Coins
• 🔥 Sun Breathing Blessing: 2500 Coins

👑 **GOD-TIER LEGENDARY CARDS**
━━━━━━━━━━━━━━━━━━━━━
⚔️ **Yoriichi Tsugikuni**
Power: 20000 | Price: ₹499

👹 **Muzan Kibutsuji**
Power: 15500 | Price: ₹399

🌙 **Kokushibo**
Power: 12000 | Price: ₹199`;

        const opts = {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: '✨ Essence & Blessings', callback_data: 'shop_essence' }],
                    [
                        { text: '⚔️ Buy Yoriichi', callback_data: 'buy_yoriichi' },
                        { text: '👹 Buy Muzan', callback_data: 'buy_muzan' }
                    ],
                    [{ text: '🌙 Buy Kokushibo', callback_data: 'buy_kokushibo' }]
                ]
            }
        };
        bot.sendMessage(chatId, premiumMenu, opts);
    });

    // 2. Button Logic
    bot.on('callback_query', async (query) => {
        const chatId = query.message.chat.id;
        const data = query.data;

        // Show QR when user selects a character
        if (data.startsWith('buy_')) {
            const charName = data.split('_')[1];
            await bot.sendMessage(chatId, `You selected ${charName.toUpperCase()}. Scan the QR code below to pay.`);
            await bot.sendPhoto(chatId, 'https://image-link.edgeone.app/1779687803104-dh71y4.jpg', {
                caption: "Payment ke baad screenshot aur UTR number yahan bhejein."
            });
            bot.answerCallbackQuery(query.id);
        }

        // Admin Approval Logic
        if (data.startsWith('approve_')) {
            const userId = data.split('_')[1];
            // ADD YOUR DATABASE UPDATE LOGIC HERE (e.g., db.collection('users').updateOne(...))
            bot.sendMessage(userId, "🎉 Congratulations! Your payment is approved. The card has been added to your profile.");
            bot.sendMessage(chatId, "✅ User Approved.");
            bot.answerCallbackQuery(query.id);
        }
    });

    // 3. Receive Payment Proof (SS)
    bot.on('photo', (msg) => {
        const chatId = msg.chat.id;
        const photoId = msg.photo[msg.photo.length - 1].file_id;

        bot.sendPhoto(ADMIN_ID, photoId, {
            caption: `🚨 New payment proof from User: ${chatId}`,
            reply_markup: {
                inline_keyboard: [[
                    { text: '✅ Approve', callback_data: `approve_${chatId}` },
                    { text: '❌ Reject', callback_data: `reject_${chatId}` }
                ]]
            }
        });
        bot.sendMessage(chatId, "✅ Proof submitted! Admin will verify your payment shortly.");
    });
};

module.exports = premium;
