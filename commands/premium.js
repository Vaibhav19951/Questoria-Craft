/**
 * VELIX OS V2.5 | SECURE PREMIUM GATEWAY & MANUAL VALIDATION LEDGER
 * Fully Integrated with godchar.js Core Registry & Local Asset QR Stream
 * Thread-Safe Data Mutation Protocol with Perimeter Isolated Callback Guards
 */

const fs = require('fs');
const path = require('path');
// ✅ FIXED: Name updated to godchar and relative path adjusted for commands/ directory
const godTierRegistry = require("../asset/godchar");
const godCharManifest = godTierRegistry.godTierManifest || {};

console.log("💎 [LOADED SUCCESS] Secure Premium Transaction Gateway Synced: premium.js");

module.exports = (bot) => {
  const ADMIN_ID = '2086993762'; // Velix OS Operator Unique Master Identifier

  // Memory map to track active user purchase intents and prevent global photo hijacking
  const pendingPaymentSessions = {};

  // 💳 Automated Pricing Chart for Characters & Dynamic Material Bundles
  const premiumPriceChart = {
    // God-Char Cards
    yoriichi_godtier: { name: "Yoriichi Tsugikuni (Card)", price: "₹499", type: "card" },
    muzan_godtier: { name: "Muzan Kibutsuji (Card)", price: "₹399", type: "card" },
    kokushibo_godtier: { name: "Kokushibo (Card)", price: "₹199", type: "card" },

    // Dynamic Materials (Essence & Blessing Bundles)
    yoriichi_essence_pack: { name: "Yoriichi God-Char Essence x50 + Blessing x5", price: "₹249", type: "material", target: "yoriichi_godtier" },
    muzan_essence_pack: { name: "Muzan God-Char Essence x50 + Blessing x5", price: "₹199", type: "material", target: "muzan_godtier" },
    kokushibo_essence_pack: { name: "Kokushibo God-Char Essence x50 + Blessing x5", price: "₹149", type: "material", target: "kokushibo_godtier" },
    universal_awakening_stone: { name: "Universal Awakening Catalyst Stone x1", price: "₹99", type: "universal" }
  };

  // 📂 FIXED: Points dynamically out of commands/ and goes into asset/qr.jpg
  const LOCAL_QR_PATH = path.join(__dirname, '..', 'asset', 'qr.jpg'); 

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
            { text: '👑 God-Char Cards', callback_data: 'prem_view_godtier' }
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

    if (!data.startsWith('prem_')) return;

    try {
      // 1. DISPLAY GOD-CHAR CARDS
      if (data === 'prem_view_godtier') {
        bot.answerCallbackQuery(query.id);
        
        let godTierMenu = `👑 **VELIX OS | GOD-CHAR LEGENDARY CARDS**\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        Object.keys(godCharManifest).forEach(key => {
          const char = godCharManifest[key];
          const price = premiumPriceChart[key] ? premiumPriceChart[key].price : "₹499";
          
          if (char && char.id !== "godTierArray" && char.id !== "godTierManifest") {
             godTierMenu += `⚡ **${char.name}**\n   🔹 Destructive Power: \`${char.power || char.atk} POW\`\n   └ 💳 Premium Value: \`${price}\`\n\n`;
          }
        });

        godTierMenu += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n*Select a target unit to initiate secure cash checkout routing:*`;

        return bot.sendMessage(chatId, godTierMenu, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '⚔️ Buy Yoriichi', callback_data: 'prem_buy_yoriichi_godtier' },
                { text: '👹 Buy Muzan', callback_data: 'prem_buy_muzan_godtier' },
                { text: '🌙 Buy Kokushibo', callback_data: 'prem_buy_kokushibo_godtier' }
              ]
            ]
          }
        });
      }

      // 2. DISPLAY ESSENCE & AWAKENING BUNDLES
      if (data === 'prem_shop_essence') {
        bot.answerCallbackQuery(query.id);

        const materialMenu = `✨ **VELIX OS | ELITE MATERIAL & AWAKENING VAULT**\n` +
                             `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                             `Consumables required for upgrading active God-Chars:\n\n` +
                             `🧬 **Yoriichi Upgrade Pack**\n   🔹 \`50 Essence\` + \`5 Blessings\` ➔ \`₹249\`\n\n` +
                             `🧪 **Muzan Upgrade Pack**\n   🔹 \`50 Essence\` + \`5 Blessings\` ➔ \`₹199\`\n\n` +
                             `🌙 **Kokushibo Upgrade Pack**\n   🔹 \`50 Essence\` + \`5 Blessings\` ➔ \`₹149\`\n\n` +
                             `💎 **Universal Awakening Stone**\n   🔹 \`Instant Level Break\` ➔ \`₹99\`\n` +
                             `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                             `*Select a packet component grid below to build checkout gateway:*`;

        return bot.sendMessage(chatId, materialMenu, {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                { text: '🧬 Yoriichi Pack', callback_data: 'prem_buy_yoriichi_essence_pack' },
                { text: '🧪 Muzan Pack', callback_data: 'prem_buy_muzan_essence_pack' }
              ],
              [
                { text: '🌙 Kokushibo Pack', callback_data: 'prem_buy_kokushibo_essence_pack' },
                { text: '💎 Awakening Stone', callback_data: 'prem_buy_universal_awakening_stone' }
              ]
            ]
          }
        });
      }

      // 3. DISPATCH SECURE LOCAL QR FILE STREAM WITH USER SESSION LOCK
      if (data.startsWith('prem_buy_')) {
        bot.answerCallbackQuery(query.id);
        const selectedAssetKey = data.replace('prem_buy_', '');
        
        const itemObj = premiumPriceChart[selectedAssetKey];
        if (!itemObj) return;

        // Open user state lock session
        pendingPaymentSessions[clickerId] = selectedAssetKey;

        await bot.sendMessage(chatId, `🔥 *Selection Locked:* \`${itemObj.name.toUpperCase()}\`\nFetching secure local terminal QR frame ledger...`, { parse_mode: 'Markdown' });
        
        // Safety validation to prevent crashes if file mapping gets unlinked
        if (!fs.existsSync(LOCAL_QR_PATH)) {
            console.error(`❌ QR Error: Local photo file not found at path: ${LOCAL_QR_PATH}`);
            return bot.sendMessage(chatId, "❌ **Gateway Offline:** Central terminal QR matrix asset file missing inside 'asset/' directory.");
        }

        return bot.sendPhoto(chatId, fs.createReadStream(LOCAL_QR_PATH), {
          caption: `📸 **VELIX OS SECURE CORES | PAYMENT CHANNEL**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                   `📦 **Purchase Item:** \`${itemObj.name}\`\n` +
                   `💳 **Total Amount Due:** \`${itemObj.price}\`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                   `1. Scan this verified system host ledger QR code to route funds.\n` +
                   `2. Once routed, send the **clear receipt screenshot** directly into this chat loop.\n\n` +
                   `⚠️ *Security Guardrail: Session active until snapshot transmission received.*`,
          parse_mode: 'Markdown'
        });
      }

      // 4. ADMIN APPROVAL CORES (HANDLES CARDS, ESSENCE & BLESSING INJECTIONS)
      if (data.startsWith('prem_approve_')) {
        if (clickerId !== ADMIN_ID) return bot.answerCallbackQuery(query.id, { text: "Access Denied: Operator level mismatch.", show_alert: true });
        bot.answerCallbackQuery(query.id);

        const [_, __, targetUserId, assetIdKey] = data.split('_');
        const itemObj = premiumPriceChart[assetIdKey];

        if (!itemObj) return bot.sendMessage(chatId, "❌ **Ledger Fault:** Premium asset target identifier data unverified.");

        const targetProfile = bot.getPlayerData ? bot.getPlayerData(targetUserId) : null;
        if (!targetProfile) return bot.sendMessage(chatId, "❌ **Sync Malfunction:** Target profile block missing.");

        if (!targetProfile.inventory) targetProfile.inventory = [];
        if (!targetProfile.materials) targetProfile.materials = {};

        let displayLogName = itemObj.name;

        // EXECUTION PATH A: Injecting full Slayers Cards
        if (itemObj.type === "card") {
          const assetObj = godCharManifest[assetIdKey];
          targetProfile.inventory.push({
            id: assetObj.id,
            name: assetObj.name,
            rarity: "God-Char",
            level: assetObj.level || 1,
            exp: assetObj.xp || 0,
            max_xp: assetObj.max_xp || 1000,
            power: assetObj.power || 4000,
            atk: assetObj.atk || 4000,
            image: assetObj.image || "",
            type: assetObj.type || "Physical",
            isAwakened: false,
            awakeningStage: 0,
            acquiredAt: new Date().toISOString()
          });
        } 
        // EXECUTION PATH B: Injecting God-Char Character Essences & Blessings (Dynamic keys matching spin.js structure)
        else if (itemObj.type === "material") {
          const baseKey = itemObj.target; // e.g., 'yoriichi_godtier'
          const essenceKey = `${baseKey}_god_char_essence`;
          const blessingKey = `${baseKey}_god_char_blessing`;

          targetProfile.materials[essenceKey] = (parseInt(targetProfile.materials[essenceKey], 10) || 0) + 50;
          targetProfile.materials[blessingKey] = (parseInt(targetProfile.materials[blessingKey], 10) || 0) + 5;
        } 
        // EXECUTION PATH C: Universal Awakening Stone
        else if (itemObj.type === "universal") {
          targetProfile.materials["universal_awakening_stone"] = (parseInt(targetProfile.materials["universal_awakening_stone"], 10) || 0) + 1;
        }

        if (bot.savePlayerData) bot.savePlayerData(targetUserId, targetProfile);

        // Notify client node
        await bot.sendMessage(targetUserId, 
          `🎉 **VELIX OS | TRANSACTION AUTHORIZED & SYNCED**\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Your payment for **${displayLogName.toUpperCase()}** has been verified. Premium packages have been injected into your profile bank matrix successfully!\n\n` +
          `👉 *Rerun \`/inventory\` or check your active ledger profiles to view assets.*`, 
          { parse_mode: 'Markdown' }
        ).catch(() => {});

        return bot.editMessageCaption(`✅ **Transaction Fully Approved & Assets Delivered**\n👤 Node Client: \`${targetUserId}\`\n🎁 Delivered Bundle: \`${displayLogName}\``, {
          chat_id: chatId, message_id: messageId, parse_mode: 'Markdown'
        }).catch(() => {});
      }

      // 5. ADMIN REJECTION FLOW
      if (data.startsWith('prem_reject_')) {
        if (clickerId !== ADMIN_ID) return bot.answerCallbackQuery(query.id, { text: "Access Denied: Operator level mismatch.", show_alert: true });
        bot.answerCallbackQuery(query.id);

        const targetUserId = data.split('_')[2];

        await bot.sendMessage(targetUserId, 
          `❌ **VELIX OS | REGISTRY AUTHORIZATION REFUSED**\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Your submitted documentation receipt material could not be cross-verified through merchant bank records.\n\n` +
          `💡 *Contact operator support lines if you think this is an index calculation error.*`, 
          { parse_mode: 'Markdown' }
        ).catch(() => {});

        return bot.editMessageCaption(`❌ **Transaction Marked Defective & Rejected**\n👤 Target Client Node: \`${targetUserId}\``, {
          chat_id: chatId, message_id: messageId, parse_mode: 'Markdown'
        }).catch(() => {});
      }

    } catch (error) {
      console.error("❌ Premium callback system loop crash trap:", error.message);
    }
  });

  // ==========================================
  // 📸 3. RECEIPT SCREENSHOT INTERCEPTOR
  // ==========================================
  bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id.toString();
    
    if (senderId === ADMIN_ID || !pendingPaymentSessions[senderId]) return;

    const lockedAssetKey = pendingPaymentSessions[senderId];
    const itemObj = premiumPriceChart[lockedAssetKey];
    
    const photoId = msg.photo[msg.photo.length - 1].file_id;
    const userTag = msg.from.username ? `@${msg.from.username}` : `Client Node: ${msg.from.first_name}`;

    try {
      await bot.sendPhoto(ADMIN_ID, photoId, {
        caption: `🚨 **VELIX OS | INCOMING PREMIUM VERIFICATION**\n` +
                 `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                 `👤 **Origin Account:** ${userTag}\n` +
                 `🆔 **User ID:** \`${senderId}\`\n` +
                 `📦 **Demanded Asset:** \`${itemObj ? itemObj.name : "Unknown Item"}\`\n` +
                 `💳 **Paid Value:** \`${itemObj ? itemObj.price : "FREE"}\`\n\n` +
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

      delete pendingPaymentSessions[senderId];

      await bot.sendMessage(chatId, 
        `✅ **VELIX OS SYSTEM NOTICE:**\n` +
        `Your verification receipt screenshot packet has been securely dispatched to the master cockpit console DM ledger. Please stand-by while operations complete processing.`, 
        { parse_mode: 'Markdown' }
      );

    } catch (err) {
      console.error("❌ Critical Owner Cockpit DM Forwarding failure:", err.message);
    }
  });
};
