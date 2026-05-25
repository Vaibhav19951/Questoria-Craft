/**
 * VELIX OS V2.5 | SECURE PREMIUM GATEWAY & MANUAL VALIDATION LEDGER
 * Fully Integrated with Centralized Ledger Hooks & Targeted Session Tracking
 * Thread-Safe Data Mutation Protocol with Perimeter Isolated Callback Guards
 */

console.log("💎 [LOADED SUCCESS] Secure Premium Transaction Gateway Synced: premium.js");

module.exports = (bot) => {
  const ADMIN_ID = '2086993762'; // Velix OS Operator Unique Master Identifier

  // Memory map to track active user purchase intents and prevent global photo hijacking
  const pendingPaymentSessions = {};

  // Hardcoded technical statistics for God-Tier Armaments
  const godTierAssets = {
    yoriichi: { name: "Yoriichi Tsugikuni", power: 5000, price: "₹499", id: "yoriichi_god" },
    muzan: { name: "Muzan Kibutsuji", power: 4500, price: "₹399", id: "muzan_god" },
    kokushibo: { name: "Kokushibo", power: 4000, price: "₹199", id: "kokushibo_god" }
  };

  // ==========================================
  // 💎 1. INITIAL PREMIUM GATEWAY MENU (/premium)
  // ==========================================
  bot.onText(/\/premium/, (msg) => {
    const chatId = msg.chat.id;
    
    const opts = {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✨ Essence & Blessings', callback_data: 'prem_shop_essence' },
            { text: '👑 God-Tier Cards', callback_data: 'prem_view_godtier' }
          ]
        ]
      }
    };
    
    bot.sendMessage(chatId, 
      `💎 **VELIX OS | GOD SLAYER PREMIUM SYSTEM ARCHITECTURE**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Welcome operator to the premium network integration terminal. Select a layer branch from the layout interface below to proceed:`, 
      { parse_mode: 'Markdown', ...opts }
    ).catch(e => console.error(e.message));
  });

  // ==========================================
  // 🎮 2. PERIMETER ISOLATED CALLBACK QUERIES
  // ==========================================
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const clickerId = query.from.id.toString();
    const data = query.data;
    const messageId = query.message.message_id;

    // Guard perimeter checking if callback context belongs to this module strictly
    if (!data.startsWith('prem_')) return;

    try {
      // 1. DISPLAY GOD-TIER ARSENAL CATALYST LIST
      if (data === 'prem_view_godtier') {
        bot.answerCallbackQuery(query.id);
        
        const godTierMenu = `👑 **VELIX OS | GOD-TIER LEGENDARY MANIFEST**\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `⚔️ **Yoriichi Tsugikuni**\n   🔹 Destructive Power: \`5000 POW\`\n   └ 💳 Premium Value: \`₹499\`\n\n` +
                            `👹 **Muzan Kibutsuji**\n   🔹 Destructive Power: \`4500 POW\`\n   └ 💳 Premium Value: \`₹399\`\n\n` +
                            `🌙 **Kokushibo**\n   🔹 Destructive Power: \`4000 POW\`\n   └ 💳 Premium Value: \`₹199\`\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                            `*Select a target unit button grid below to establish transaction channel initialization:*`;

        return bot.sendMessage(chatId, godTierMenu, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '⚔️ Buy Yoriichi', callback_data: 'prem_buy_yoriichi' },
                { text: '👹 Buy Muzan', callback_data: 'prem_buy_muzan' },
                { text: '🌙 Buy Kokushibo', callback_data: 'prem_buy_kokushibo' }
              ]
            ]
          }
        });
      }

      // 2. DISPATCH SECURE QR ROUTING LINK AND INITIALIZE SESSION LOCK
      if (data.startsWith('prem_buy_')) {
        bot.answerCallbackQuery(query.id);
        const selectedAssetKey = data.replace('prem_buy_', '');
        
        if (!godTierAssets[selectedAssetKey]) return;

        // Open transaction lock session for this specific user node
        pendingPaymentSessions[clickerId] = selectedAssetKey;

        await bot.sendMessage(chatId, `🔥 *Target Selected:* \`${godTierAssets[selectedAssetKey].name.toUpperCase()}\`\nGenerating encrypted routing payment gateway link...`, { parse_mode: 'Markdown' });
        
        return bot.sendPhoto(chatId, 'https://image-link.edgeone.app/1779687803104-dh71y4.jpg', {
          caption: `📸 **VELIX OS SECURE PAYMENT GATEWAY QR**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                   `1. Scan this verified dynamic merchant registry QR matrix code to fulfill settlement.\n` +
                   `2. Once payment is routed, send the **clear transaction receipt screenshot** directly into this chat.\n\n` +
                   `⚠️ *System Security Guardrail: Please upload receipt within this active window session framework.*`,
          parse_mode: 'Markdown'
        });
      }

      // 3. ADMIN TRANSACTION APPROVAL GATE (REAL DATA INJECTION LABELS)
      if (data.startsWith('prem_approve_')) {
        if (clickerId !== ADMIN_ID) return bot.answerCallbackQuery(query.id, { text: "Access Denied: Operator level mismatch.", show_alert: true });
        bot.answerCallbackQuery(query.id);

        const [_, __, targetUserId, assetIdKey] = data.split('_');
        const assetObj = godTierAssets[assetIdKey];

        if (!assetObj) return bot.sendMessage(chatId, "❌ **Ledger Fault:** Premium asset target identifier data is unverified or corrupted.");

        // Pull user profile structural files securely via central hooks
        const targetProfile = bot.getPlayerData ? bot.getPlayerData(targetUserId) : null;
        
        if (targetProfile) {
          if (!targetProfile.inventory) targetProfile.inventory = [];

          // Real-time backend physical object item serialization
          targetProfile.inventory.push({
            id: assetObj.id,
            name: assetObj.name,
            type: "god_tier_slayer",
            level: 1,
            power: assetObj.power,
            acquiredAt: new Date().toISOString()
          });

          // Commit back mutations to central file ledger nodes
          if (bot.savePlayerData) bot.savePlayerData(targetUserId, targetProfile);

          // Alert target node buyer regarding balance injection sync
          await bot.sendMessage(targetUserId, 
            `🎉 **VELIX OS | TRANSACTION AUTHORIZED**\n` +
            `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
            `The premium **${assetObj.name.toUpperCase()}** operational frame configuration has successfully synchronized down into your vault matrix.\n\n` +
            `👉 *Execute \`/inventory\` or \`/profile\` inside your terminal loop to confirm initialization status.*`, 
            { parse_mode: 'Markdown' }
          ).catch(() => {});

          // Refresh UI components inside master cockpit view panel
          return bot.editMessageCaption(`✅ **Transaction Fully Approved & Injected**\n👤 Target Client Node: \`${targetUserId}\`\n🎴 Injected Asset: \`${assetObj.name}\``, {
            chat_id: chatId,
            message_id: messageId,
            parse_mode: 'Markdown'
          }).catch(() => {});
        } else {
          return bot.sendMessage(chatId, "❌ **Sync Malfunction:** Targeted user file block tracking parameters could not be located inside global runtime states.");
        }
      }

      // 4. ADMIN REJECTION FLOW FOR INVALID PACKET VERIFICATION
      if (data.startsWith('prem_reject_')) {
        if (clickerId !== ADMIN_ID) return bot.answerCallbackQuery(query.id, { text: "Access Denied: Operator level mismatch.", show_alert: true });
        bot.answerCallbackQuery(query.id);

        const targetUserId = data.split('_')[2];

        await bot.sendMessage(targetUserId, 
          `❌ **VELIX OS | REGISTRY AUTHORIZATION REFUSED**\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Your submitted documentation receipt material could not be cross-verified through central verification networks.\n\n` +
          `💡 *If this is an indexing mistake, rerun your transaction layer sequence or reach technical operator support lines.*`, 
          { parse_mode: 'Markdown' }
        ).catch(() => {});

        return bot.editMessageCaption(`❌ **Transaction Marked Defective & Rejected**\n👤 Target Client Node: \`${targetUserId}\``, {
          chat_id: chatId,
          message_id: messageId,
          parse_mode: 'Markdown'
        }).catch(() => {});
      }

    } catch (error) {
      console.error("❌ Premium callback system error structural loop trap:", error.message);
    }
  });

  // ==========================================
  // 📸 3. TARGETED DOCUMENT PHOTO INTERCEPTOR (PROXIED PROTECTION)
  // ==========================================
  bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id.toString();
    
    // Safety isolation: Stop administrative accounts or random unsolicited image packets from spamming channels
    if (senderId === ADMIN_ID || !pendingPaymentSessions[senderId]) return;

    const lockedAssetKey = pendingPaymentSessions[senderId];
    const assetObj = godTierAssets[lockedAssetKey];
    
    const photoId = msg.photo[msg.photo.length - 1].file_id;
    const userTag = msg.from.username ? `@${msg.from.username}` : `Client Node: ${msg.from.first_name}`;

    try {
      // Forward asset down into Cockpit Interface control layout mapping view
      await bot.sendPhoto(ADMIN_ID, photoId, {
        caption: `🚨 **VELIX OS | INCOMING INVOICE VERIFICATION**\n` +
                 `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                 `👤 **Origin Account:** ${userTag}\n` +
                 `🆔 **Internal User ID:** \`${senderId}\`\n` +
                 `📦 **Demanded Asset Tier:** \`${assetObj ? assetObj.name : "Unknown Frame"}\`\n\n` +
                 `*Verify validation signatures through merchant banks carefully before updating active ledger arrays:*`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Approve Asset Drop', callback_data: `prem_approve_${senderId}_${lockedAssetKey}` },
              { text: '❌ Reject Transaction', callback_data: `prem_reject_${senderId}` }
            ]
          ]
        }
      });

      // Erase active tracking context state parameters since transmission finalized successfully
      delete pendingPaymentSessions[senderId];

      await bot.sendMessage(chatId, 
        `✅ **VELIX OS SYSTEM NOTICE:**\n` +
        `Your verification receipt screenshot packet has been securely dispatched to the main console DM ledger for verification validation. Please stand-by while system operations clear verification.`, 
        { parse_mode: 'Markdown' }
      );

    } catch (err) {
      console.error("❌ Critical Owner Cockpit DM Forwarding failure:", err.message);
    }
  });
};
