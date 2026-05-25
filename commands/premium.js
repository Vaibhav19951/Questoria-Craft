/**
 * VELIX OS V2.5 | SECURE PREMIUM GATEWAY & MANUAL VALIDATION LEDGER
 * Fully Integrated with godchar.js Core Registry & Local Asset QR Stream
 */

const fs = require('fs');
const path = require('path');
const godTierRegistry = require("../asset/godchar");
const godCharManifest = godTierRegistry.godTierManifest || {};

console.log("💎 [LOADED SUCCESS] Secure Premium Transaction Gateway Synced: premium.js");

module.exports = (bot) => {
  const ADMIN_ID = '2086993762'; // Velix OS Operator Master Identifier

  // Session state memory map
  const pendingPaymentSessions = {};

  // 💳 Automated Pricing Chart
  const premiumPriceChart = {
    yoriichi_godtier: { name: "Yoriichi Tsugikuni (Card)", price: "₹499", type: "card" },
    muzan_godtier: { name: "Muzan Kibutsuji (Card)", price: "₹399", type: "card" },
    kokushibo_godtier: { name: "Kokushibo (Card)", price: "₹199", type: "card" },

    yoriichi_essence_pack: { name: "Yoriichi God-Char Essence x50 + Blessing x5", price: "₹249", type: "material", target: "yoriichi_godtier" },
    muzan_essence_pack: { name: "Muzan God-Char Essence x50 + Blessing x5", price: "₹199", type: "material", target: "muzan_godtier" },
    kokushibo_essence_pack: { name: "Kokushibo God-Char Essence x50 + Blessing x5", price: "₹149", type: "material", target: "kokushibo_godtier" },
    universal_awakening_stone: { name: "Universal Awakening Catalyst Stone x1", price: "₹99", type: "universal" }
  };

  const LOCAL_QR_PATH = path.join(process.cwd(), 'asset', 'qr.jpg'); 

  // ==========================================
  // 💎 1. INITIAL PREMIUM MENU (/premium)
  // ==========================================
  bot.onText(/\/premium/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    
    // Auto sync player data layout structure first
    bot.getPlayerData(userId);

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
      `💎 **%VELIX OS | GOD SLAYER PREMIUM ARCHITECTURE%**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Welcome operator to the premium network integration terminal. Select a layer branch below to proceed:`, 
      { parse_mode: 'Markdown', ...opts }
    ).catch(e => console.error(e.message));
  });

  // ==========================================
  // 🎮 2. CALLBACK QUERY CONTROLLER
  // ==========================================
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const clickerId = query.from.id.toString();
    const data = query.data;
    const messageId = query.message.message_id;

    if (!data.startsWith('prem_')) return;

    try {
      // 1. VIEW CARDS
      if (data === 'prem_view_godtier') {
        await bot.answerCallbackQuery(query.id).catch(() => {});
        
        let godTierMenu = `👑 **VELIX OS | GOD-CHAR LEGENDARY CARDS**\n` +
                          `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

        Object.keys(godCharManifest).forEach(key => {
          const char = godCharManifest[key];
          const price = premiumPriceChart[key] ? premiumPriceChart[key].price : "₹499";
          
          if (char && char.id !== "godTierArray" && char.id !== "godTierManifest") {
             godTierMenu += `⚡ **${char.name}**\n   🔹 Power: \`${char.power || char.atk || 4000} POW\`\n   └ 💳 Price: \`${price}\`\n\n`;
          }
        });

        godTierMenu += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n*Select a unit to initiate payment routing:*`;

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

      // 2. VIEW ESSENCE BUNDLES
      if (data === 'prem_shop_essence') {
        await bot.answerCallbackQuery(query.id).catch(() => {});

        const materialMenu = `✨ **VELIX OS | ELITE MATERIAL & AWAKENING VAULT**\n` +
                             `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                             `🧬 **Yoriichi Upgrade Pack** ➔ \`₹249\`\n\n` +
                             `🧪 **Muzan Upgrade Pack** ➔ \`₹199\`\n\n` +
                             `🌙 **Kokushibo Upgrade Pack** ➔ \`₹149\`\n\n` +
                             `💎 **Universal Awakening Stone** ➔ \`₹99\`\n` +
                             `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

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

      // 3. ACTION: GENERATE QR CHANNEL
      if (data.startsWith('prem_buy_')) {
        await bot.answerCallbackQuery(query.id).catch(() => {});
        const selectedAssetKey = data.replace('prem_buy_', '');
        
        const itemObj = premiumPriceChart[selectedAssetKey];
        if (!itemObj) return;

        pendingPaymentSessions[clickerId] = selectedAssetKey;

        await bot.sendMessage(chatId, `🔥 *Selection Locked:* \`${itemObj.name.toUpperCase()}\`\nFetching dynamic QR frame terminal ledger...`, { parse_mode: 'Markdown' });
        
        if (!fs.existsSync(LOCAL_QR_PATH)) {
            console.error(`❌ QR Error: Path missing: ${LOCAL_QR_PATH}`);
            return bot.sendMessage(chatId, "❌ **Gateway Offline:** QR asset file `qr.jpg` missing in `asset/` folder.");
        }

        return bot.sendPhoto(chatId, fs.createReadStream(LOCAL_QR_PATH), {
          caption: `📸 **VELIX OS SECURE CORES | PAYMENT CHANNEL**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                   `📦 **Purchase Item:** \`${itemObj.name}\`\n` +
                   `💳 **Total Amount:** \`${itemObj.price}\`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                   `1. Scan this system verification QR code to route funds.\n` +
                   `2. Send the **clear receipt screenshot** directly into this chat loop.\n\n` +
                   `⚠️ *Session active until snapshot transmission received.*`,
          parse_mode: 'Markdown'
        });
      }

      // 4. ADMIN ACTION: APPROVE DROP
      if (data.startsWith('prem_approve_')) {
        await bot.answerCallbackQuery(query.id).catch(() => {});
        if (clickerId !== ADMIN_ID) return;

        const chunks = data.split('_'); // [prem, approve, targetUserId, asset, type]
        const targetUserId = chunks[2];
        const assetIdKey = chunks.slice(3).join('_'); // Combines remaining keys cleanly

        const itemObj = premiumPriceChart[assetIdKey];
        if (!itemObj) return bot.sendMessage(chatId, "❌ **Ledger Fault:** Unverified target key payload.");

        const targetProfile = bot.getPlayerData(targetUserId);
        if (!targetProfile) return bot.sendMessage(chatId, "❌ **Sync Malfunction:** Target profile missing.");

        if (!targetProfile.inventory) targetProfile.inventory = [];
        if (!targetProfile.materials) targetProfile.materials = {};

        // INJECTION PROTOCOLS MATCHING INDEX.JS STRUCTS
        if (itemObj.type === "card") {
          const assetObj = godCharManifest[assetIdKey] || { id: assetIdKey, name: itemObj.name };
          targetProfile.inventory.push({
            id: assetObj.id || assetIdKey,
            name: assetObj.name,
            rarity: "God-Tier",
            level: 1,
            exp: 0,
            max_xp: 1000,
            power: assetObj.power || assetObj.atk || 4500,
            atk: assetObj.atk || 4500,
            image: assetObj.image || assetObj.img || "",
            type: "God",
            isAwakened: false,
            awakeningStage: 0
          });
        } 
        else if (itemObj.type === "material") {
          const baseKey = itemObj.target; 
          const essenceKey = `${baseKey}_god_char_essence`;
          const blessingKey = `${baseKey}_god_char_blessing`;

          targetProfile.materials[essenceKey] = (parseInt(targetProfile.materials[essenceKey], 10) || 0) + 50;
          targetProfile.materials[blessingKey] = (parseInt(targetProfile.materials[blessingKey], 10) || 0) + 5;
        } 
        else if (itemObj.type === "universal") {
          targetProfile.materials["universal_awakening_stone"] = (parseInt(targetProfile.materials["universal_awakening_stone"], 10) || 0) + 1;
        }

        // Commit database synchronization state
        bot.savePlayerData(targetUserId, targetProfile);

        await bot.sendMessage(targetUserId, 
          `🎉 **VELIX OS | TRANSACTION AUTHORIZED & SYNCED**\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Your payment for **${itemObj.name.toUpperCase()}** has been verified! Assets have been successfully injected into your profile inventory system.`, 
          { parse_mode: 'Markdown' }
        ).catch(() => {});

        return bot.editMessageCaption(`✅ **Transaction Approved & Assets Delivered**\n👤 Node Client: \`${targetUserId}\`\n🎁 Delivered Bundle: \`${itemObj.name}\``, {
          chat_id: chatId, message_id: messageId, parse_mode: 'Markdown'
        }).catch(() => {});
      }

      // 5. ADMIN ACTION: REJECT
      if (data.startsWith('prem_reject_')) {
        await bot.answerCallbackQuery(query.id).catch(() => {});
        if (clickerId !== ADMIN_ID) return;

        const targetUserId = data.split('_')[2];

        await bot.sendMessage(targetUserId, 
          `❌ **VELIX OS | REGISTRY AUTHORIZATION REFUSED**\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `Your submitted document verification receipt could not be cross-verified through merchant records.`, 
          { parse_mode: 'Markdown' }
        ).catch(() => {});

        return bot.editMessageCaption(`❌ **Transaction Marked Defective & Rejected**\n👤 Target Client Node: \`${targetUserId}\``, {
          chat_id: chatId, message_id: messageId, parse_mode: 'Markdown'
        }).catch(() => {});
      }

    } catch (error) {
      console.error("❌ Premium loop trap crash resolved:", error);
    }
  });

  // ==========================================
  // 📸 3. RECEIPT INTERCEPTOR (SAVES SESSION)
  // ==========================================
  bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id.toString();
    
    if (!pendingPaymentSessions[senderId]) return;

    const lockedAssetKey = pendingPaymentSessions[senderId];
    const itemObj = premiumPriceChart[lockedAssetKey];
    
    const photoId = msg.photo[msg.photo.length - 1].file_id;
    const userTag = msg.from.username ? `@${msg.from.username}` : `Client Node: ${msg.from.first_name}`;

    try {
      await bot.sendPhoto(ADMIN_ID, photoId, {
        caption: `🚨 **VELIX OS | INCOMING PREMIUM VERIFICATION**\n` +
                 `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                 `👤 **From:** ${userTag}\n` +
                 `🆔 **User ID:** \`${senderId}\`\n` +
                 `📦 **Asset Demanded:** \`${itemObj ? itemObj.name : "Unknown Item"}\`\n` +
                 `💳 **Paid Value:** \`${itemObj ? itemObj.price : "FREE"}\``,
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
        `Your verification receipt screenshot has been dispatched to the administration panel. Please stand-by while operations complete data checking.`, 
        { parse_mode: 'Markdown' }
      );

    } catch (err) {
      console.error("❌ Owner forward error handler resolved:", err.message);
    }
  });
};
