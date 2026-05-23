console.log("✅ INDEPENDENT CHARACTER ECOSYSTEM LOADED WITH MASTER COMMANDS");

const fs = require("fs");
const path = require("path");

// ==========================================
// PATHS & RESOURCE LOADING SETUP
// ==========================================
const dataDir = path.join(__dirname, "../data");
const playerFile = path.join(dataDir, "players.json");

// Pull existing card databases seamlessly
const { characters: normalCards } = require("../asset/assets.js");
const { mythical: mythicCards } = require("../asset/mythical.js");

try {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(playerFile)) fs.writeFileSync(playerFile, JSON.stringify({}), "utf8");
} catch (err) {
  console.error("❌ Error initializing system storage logs:", err.message);
}

let players = {};
try { players = JSON.parse(fs.readFileSync(playerFile, "utf8")); } catch { players = {}; }

const savePlayers = () => fs.writeFileSync(playerFile, JSON.stringify(players, null, 2), "utf8");

module.exports = (bot) => {

  // Dynamic profile initializer node helper
  const getPlayer = (userId) => {
    if (!players[userId]) {
      players[userId] = { coins: 0, mythicalCrystals: 0, inventory: [], level: 1, xp: 0 };
      savePlayers();
    }
    if (!players[userId].inventory) {
      players[userId].inventory = [];
      savePlayers();
    }
    return players[userId];
  };

  // Resolves handle tags (@Velix) down to raw data profile index strings
  const resolveUserByTag = (mentionStr) => {
    const cleanTag = mentionStr.replace("@", "").trim().toLowerCase();
    for (const [id, profile] of Object.entries(players)) {
      if (profile.username && profile.username.toLowerCase() === cleanTag) {
        return id;
      }
    }
    return null;
  };

  // Temporary memory map holding active transaction packets pending authorizations
  const activeTrades = {};

  // ==========================================
  // 📋 1. GLOBAL CARD DIRECTORY INDEX (/charlist)
  // ==========================================
  bot.onText(/\/charlist/, async (msg) => {
    const chatId = msg.chat.id;

    const inlineKeyboard = [
      [
        { text: "🟢 View All Normal Cards", callback_data: "global_list_normal" },
        { text: "👑 View All Mythical Cards", callback_data: "global_list_mythic" }
      ]
    ];

    await bot.sendMessage(chatId, "🗇 **Global Character Reference Catalog**\nSelect a rarity tier group below to see every card registered inside the game database along with their structural reference key strings:", {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: inlineKeyboard }
    });
  });

  // ==========================================
  // 🔍 2. GLOBAL CHARACTER DIRECTORY (/char)
  // ==========================================
  bot.onText(/\/char$/, async (msg) => {
    const chatId = msg.chat.id;
    
    const allUniqueKeys = Array.from(new Set([...Object.keys(normalCards), ...Object.keys(mythicCards)]));
    
    if (allUniqueKeys.length === 0) {
      return bot.sendMessage(chatId, "⚠️ **The global character registry database is currently empty!**", { parse_mode: "Markdown" });
    }

    const keyboard = [];
    allUniqueKeys.forEach((key) => {
      const cardName = (normalCards[key] || mythicCards[key]).name || key;
      keyboard.push([{ text: `📇 ${cardName}`, callback_data: `vlist_${key}` }]);
    });

    await bot.sendMessage(chatId, "📜 **Demon Slayer Character Registry**\nSelect a character archetype profile button from the list below to review visual specifications and ownership files:", {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: keyboard }
    });
  });

  // Target quick lookups like /char tanjiro
  bot.onText(/\/char (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1].trim();
    if (input.startsWith("@") || input.includes(" ")) return; // Bypasses conflicts with admin tools

    const searchInput = input.toLowerCase().replace(/\s+/g, "_");
    const hasNormal = normalCards[searchInput] ? true : false;
    const hasMythic = mythicCards[searchInput] ? true : false;

    if (!hasNormal && !hasMythic) {
      return bot.sendMessage(chatId, `❌ **Character "${match[1]}" was not found inside registry files!**`, { parse_mode: "Markdown" });
    }

    const buttons = [];
    const charName = (hasNormal ? normalCards[searchInput].name : mythicCards[searchInput].name);

    if (hasNormal) buttons.push({ text: "🟢 Normal Version", callback_data: `vchar_${searchInput}_normal` });
    if (hasMythic) buttons.push({ text: "👑 Mythic Version", callback_data: `vchar_${searchInput}_mythic` });

    await bot.sendMessage(chatId, `🔍 **Character Matrix Located: ${charName}**\nChoose target variation layer:`, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [buttons] }
    });
  });

  // ==========================================
  // 👑 3. ADMIN INVENTORY DROP VIA CHAR OVERRIDES
  // ==========================================
  bot.onText(/\/addchar (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id.toString();

    const ADMIN_ID = "2086993762"; // Your exact User ID matching owner.js
    if (senderId !== ADMIN_ID) return;

    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) {
      return bot.sendMessage(chatId, "❌ **Format Error:** Use structure: `/addchar @username tanjiro`", { parse_mode: "Markdown" });
    }

    const [userTarget, cardKeyInput] = parts;
    const cardId = cardKeyInput.toLowerCase().replace(/\s+/g, "_");

    let targetUserId = resolveUserByTag(userTarget);
    if (!targetUserId && !isNaN(userTarget.replace("@", ""))) {
      targetUserId = userTarget.replace("@", "");
    }

    if (!targetUserId) {
      return bot.sendMessage(chatId, `❌ **User Not Found:** No profile data registered for \`${userTarget}\`.`, { parse_mode: "Markdown" });
    }

    const hasNormal = normalCards[cardId] ? true : false;
    const hasMythic = mythicCards[cardId] ? true : false;

    if (!hasNormal && !hasMythic) {
      return bot.sendMessage(chatId, `❌ **Database Error:** Character identity node \`${cardId}\` was not located inside files!`, { parse_mode: "Markdown" });
    }

    const buttons = [];
    if (hasNormal) buttons.push({ text: "🟢 Drop Normal", callback_data: `own_drop_${targetUserId}_${cardId}_normal` });
    if (hasMythic) buttons.push({ text: "👑 Drop Mythical", callback_data: `own_drop_${targetUserId}_${cardId}_mythic` });

    await bot.sendMessage(chatId, `🎁 **Character Options Found:**\nChoose rarity level to transfer to \`${userTarget}\`:`, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [buttons] }
    });
  });

  // ==========================================
  // 🤝 4. LEVEL-RESTRICTED P2P TRADING (/tradechar)
  // ==========================================
  bot.onText(/\/tradechar (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id.toString();

    if (msg.from.username) {
      const p = getPlayer(senderId);
      p.username = msg.from.username;
      savePlayers();
    }

    const input = match[1].split("|").map(item => item.trim());
    if (input.length < 5) {
      return bot.sendMessage(chatId, "❌ **Incorrect Mapping Layout!**\nUse: \`/tradechar @TargetUser | MyCardName | MyRarity | TheirCardName | TheirRarity\`", { parse_mode: "Markdown" });
    }

    const [targetMention, myCardName, myRarity, theirCardName, theirRarity] = input;
    const cleanMyRarity = myRarity.toLowerCase();
    const cleanTheirRarity = theirRarity.toLowerCase();

    // Enforce matching-tier exchange balancing rules
    if (cleanMyRarity !== cleanTheirRarity) {
      return bot.sendMessage(chatId, "❌ **Trade Vector Validation Failure:** Exchange rules strictly command balancing equivalence! **Normal cards can only trade for Normal cards, and Mythic cards can only trade for Mythic cards.**", { parse_mode: "Markdown" });
    }

    let receiverId = resolveUserByTag(targetMention);
    if (!receiverId && !isNaN(targetMention.replace("@", ""))) {
      receiverId = targetMention.replace("@", "");
    }

    if (!receiverId || !players[receiverId]) {
      return bot.sendMessage(chatId, "❌ **Transaction Interruption:** Target trading partner registration parameters not found.", { parse_mode: "Markdown" });
    }

    if (senderId === receiverId) {
      return bot.sendMessage(chatId, "❌ **Transaction Interruption:** Loop restriction active. Self-trading paths are unverified.", { parse_mode: "Markdown" });
    }

    const senderProfile = getPlayer(senderId);
    const receiverProfile = getPlayer(receiverId);

    // Dynamic search inside pipe-separated array templates
    const senderOwns = senderProfile.inventory.some(item => {
      const parts = item.split("|");
      return parts[1].toLowerCase() === myCardName.toLowerCase() && parts[3].toLowerCase() === cleanMyRarity;
    });

    const receiverOwns = receiverProfile.inventory.some(item => {
      const parts = item.split("|");
      return parts[1].toLowerCase() === theirCardName.toLowerCase() && parts[3].toLowerCase() === cleanTheirRarity;
    });

    if (!senderOwns) return bot.sendMessage(chatId, `❌ **Aborted:** You do not own \`${myCardName} (${cleanMyRarity.toUpperCase()})\`!`, { parse_mode: "Markdown" });
    if (!receiverOwns) return bot.sendMessage(chatId, `❌ **Aborted:** Trading partner does not own \`${theirCardName} (${cleanTheirRarity.toUpperCase()})\`!`, { parse_mode: "Markdown" });

    const tradeId = `t_${Date.now()}`;
    activeTrades[tradeId] = {
      sender: senderId,
      receiver: receiverId,
      senderCardName: myCardName,
      senderRarity: cleanMyRarity,
      receiverCardName: theirCardName,
      receiverRarity: cleanTheirRarity
    };

    await bot.sendMessage(chatId, `🤝 **Secure Trading Instance Generated!**\n\n👤 **Offer From Sender:** \`${myCardName} (${cleanMyRarity.toUpperCase()})\`\n👤 **Requested From Partner:** \`${theirCardName} (${cleanTheirRarity.toUpperCase()})\`\n\nDo you authorize this asset swap sequence initialization?`, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "✅ Accept Exchange", callback_data: `t_acc_${tradeId}` },
            { text: "❌ Decline Swap", callback_data: `t_dec_${tradeId}` }
          ]
        ]
      }
    });
  });

  // ==========================================
  // 🎮 5. GLOBAL INTERACTIVE CALLBACK INTERFACES
  // ==========================================
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const clickerId = query.from.id.toString();
    const data = query.data;

    if (query.from.username) {
      const p = getPlayer(clickerId);
      p.username = query.from.username;
      savePlayers();
    }

    // GLOBAL DATABASE DIRECTORY INDEX PARSER ROUTE
    if (data === "global_list_normal" || data === "global_list_mythic") {
      bot.answerCallbackQuery(query.id);

      const targetDB = (data === "global_list_mythic") ? mythicCards : normalCards;
      const targetLabel = (data === "global_list_mythic") ? "👑 MYTHICAL" : "🟢 NORMAL";
      const dbKeys = Object.keys(targetDB);

      if (dbKeys.length === 0) {
        return bot.sendMessage(chatId, `⚠️ The global **${targetLabel}** database file contains no registered assets.`, { parse_mode: "Markdown" });
      }

      let responseMessage = `📋 **GLOBAL ${targetLabel} CARD CATALOG REGISTRY**\n`;
      responseMessage += `_Use these exact Card Key IDs to look up specs or perform administrative actions:_\n\n`;

      dbKeys.forEach((key, index) => {
        const card = targetDB[key];
        const dispName = card.name || key;
        const dispType = card.type || "N/A";
        responseMessage += `${index + 1}. 🎴 **${dispName}**\n🔑 **Card Key ID:** \`${key}\`\n⚡ Element/Type: \`${dispType}\`\n\n`;
      });

      return bot.sendMessage(chatId, responseMessage, { parse_mode: "Markdown" });
    }

    // LIST ARCHETYPE PROFILE SELECTOR ROUTE
    if (data.startsWith("vlist_")) {
      const cardKey = data.replace("vlist_", "");
      const buttons = [];
      if (normalCards[cardKey]) buttons.push({ text: "🟢 Normal Version", callback_data: `vchar_${cardKey}_normal` });
      if (mythicCards[cardKey]) buttons.push({ text: "👑 Mythic Version", callback_data: `vchar_${cardKey}_mythic` });

      bot.answerCallbackQuery(query.id);
      return bot.sendMessage(chatId, `✨ **Card Configuration Layer Identified:**\nChoose structural layout path to view image arrays:`, {
        reply_markup: { inline_keyboard: [buttons] }
      });
    }

    // DIRECT INTERACTIVE LOOKUP PANEL
    if (data.startsWith("vchar_")) {
      const [_, charKey, rarity] = data.split("_");
      const cardData = (rarity === "mythic") ? mythicCards[charKey] : normalCards[charKey];

      if (!cardData) return bot.answerCallbackQuery(query.id, { text: "Database node pointer invalid!", show_alert: true });

      const player = getPlayer(clickerId);
      const cardName = cardData.name || charKey;
      
      const ownsCard = player.inventory.some(item => {
        const parts = item.split("|");
        return parts[1].toLowerCase() === cardName.toLowerCase() && parts[3].toLowerCase() === rarity;
      });
      
      const statusText = ownsCard ? "✅ **Status:** Owned inside profile catalog!" : "❌ **Status:** Unowned configuration node.";
      const rarityTag = rarity === "mythic" ? "👑 MYTHIC" : "🟢 NORMAL";
      
      const captionMessage = `✨ **Character Profile:** ${cardName} (${rarityTag})\n` +
                             `❤️ **HP Metric:** ${cardData.hp || 100} | ⚔️ **ATK Rating:** ${cardData.atk || 10}\n\n` +
                             `📝 **Data Logs:** ${cardData.desc || "No custom specification entries."}\n\n` +
                             `---------------------------\n` +
                             `${statusText}`;

      bot.answerCallbackQuery(query.id);
      const cardImage = cardData.img || cardData.image || cardData.url;

      if (cardImage && cardImage.startsWith("http")) {
        return bot.sendPhoto(chatId, cardImage, { caption: captionMessage, parse_mode: "Markdown" });
      } else {
        return bot.sendMessage(chatId, captionMessage, { parse_mode: "Markdown" });
      }
    }

    // Note: The administrative own_drop_ listener has been completely dropped from this file
    // to allow owner.js to execute administrative operations independently without double message triggers.

    // TRADE AUTHORIZATION AGREEMENT LOGIC
    if (data.startsWith("t_acc_")) {
      const tradeId = data.replace("t_acc_", "");
      const trade = activeTrades[tradeId];

      if (!trade) return bot.answerCallbackQuery(query.id, { text: "Session tracking instance expired.", show_alert: true });
      if (clickerId !== trade.receiver) return bot.answerCallbackQuery(query.id, { text: "Unauthorized system mapping. You are not the transaction recipient target!", show_alert: true });

      const senderProfile = getPlayer(trade.sender);
      const receiverProfile = getPlayer(trade.receiver);

      const sIndex = senderProfile.inventory.findIndex(item => {
        const parts = item.split("|");
        return parts[1].toLowerCase() === trade.senderCardName.toLowerCase() && parts[3].toLowerCase() === trade.senderRarity;
      });

      const rIndex = receiverProfile.inventory.findIndex(item => {
        const parts = item.split("|");
        return parts[1].toLowerCase() === trade.receiverCardName.toLowerCase() && parts[3].toLowerCase() === trade.receiverRarity;
      });

      if (sIndex === -1 || rIndex === -1) {
        delete activeTrades[tradeId];
        return bot.sendMessage(chatId, "❌ **Transaction Processing Fault:** Systems shifted state records prior to finalization.");
      }

      const [sItem] = senderProfile.inventory.splice(sIndex, 1);
      const [rItem] = receiverProfile.inventory.splice(rIndex, 1);

      senderProfile.inventory.push(rItem);
      receiverProfile.inventory.push(sItem);

      savePlayers();
      delete activeTrades[tradeId];

      bot.answerCallbackQuery(query.id);
      bot.deleteMessage(chatId, query.message.message_id).catch(() => {});

      await bot.sendMessage(chatId, `🎉 **The trade is completed successfully!**\n\nSecure items have been mutated across player inventories. Check balance profiles to review saved results.`);
      
      const sData = (trade.senderRarity === "mythic" ? mythicCards : normalCards)[trade.senderCardName.toLowerCase().replace(/\s+/g, "_")];
      if (sData && (sData.img || sData.image)) {
        await bot.sendPhoto(chatId, sData.img || sData.image, { caption: `✅ **Transferred Item Visual Record:** ${sData.name}` });
      }
    }

    // TRADE REFUSAL CANCEL PROCESS ROUTE
    if (data.startsWith("t_dec_")) {
      const tradeId = data.replace("t_dec_", "");
      const trade = activeTrades[tradeId];

      if (!trade) return bot.answerCallbackQuery(query.id, { text: "Session expired.", show_alert: true });
      if (clickerId !== trade.receiver && clickerId !== trade.sender) return bot.answerCallbackQuery(query.id, { text: "Unauthorized interaction vector.", show_alert: true });

      delete activeTrades[tradeId];
      bot.answerCallbackQuery(query.id);
      bot.deleteMessage(chatId, query.message.message_id).catch(() => {});
      return bot.sendMessage(chatId, "❌ **Trade transaction request was cancelled successfully.**");
    }
  });
};