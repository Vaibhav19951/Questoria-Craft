console.log("✅ INDEPENDENT CHARACTER ECOSYSTEM LOADED WITH MASTER COMMANDS");

const fs = require("fs");
const path = require("path");

// ==========================================
// PATHS & RESOURCE LOADING SETUP
// ==========================================
const dataDir = path.join(__dirname, "../data");
const playerFile = path.join(dataDir, "players.json");

// Correctly paths up one level and steps inside your clean asset folder
const { characters: normalCards } = require("../asset/assets.js");
const { mythical: mythicCards } = require("../asset/mythical.js");

// Establish storage architecture safely
try {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(playerFile)) fs.writeFileSync(playerFile, JSON.stringify({}), "utf8");
} catch (err) {
  console.error("❌ Error initializing system storage logs:", err.message);
}

let players = {};
try { players = JSON.parse(fs.readFileSync(playerFile, "utf8")); } catch { players = {}; }

const savePlayers = () => fs.writeFileSync(playerFile, JSON.stringify(players, null, 2));

module.exports = (bot) => {

  // Dynamic initialization node helper
  const getPlayer = (userId) => {
    if (!players[userId]) {
      players[userId] = { coins: 1000, tokens: 0, level: 1, xp: 0, characters: [] };
      savePlayers();
    }
    if (!players[userId].characters) {
      players[userId].characters = [];
      savePlayers();
    }
    return players[userId];
  };

  // Resolves standard username strings (@Velix) down to their raw system IDs
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
  // 🔍 1. GLOBAL CHARACTER DIRECTORY (/char)
  // ==========================================
  bot.onText(/\/char$/, async (msg) => {
    const chatId = msg.chat.id;
    
    // Combine unique registration profile references from across both databases
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

  // Handle targeting direct quick lookups like /char tanjiro
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
  // 👑 2. ADMIN INVENTORY INJECTION (/addchar @user card_id)
  // ==========================================
  bot.onText(/\/addchar (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id.toString();

    const ADMIN_ID = "YOUR_TELEGRAM_USER_ID"; // Replace with your exact numerical Telegram ID
    if (senderId !== ADMIN_ID) return;

    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) {
      return bot.sendMessage(chatId, "❌ **Incorrect Format Configuration!**\nUse structural mapping: `/addchar @username card_id`", { parse_mode: "Markdown" });
    }

    const [userMention, cardKeyInput] = parts;
    const cardId = cardKeyInput.toLowerCase().replace(/\s+/g, "_");

    // Track targets using explicit text lookups
    let targetUserId = resolveUserByTag(userMention);
    if (!targetUserId && !isNaN(userMention)) {
      targetUserId = userMention; // Fallback directly if raw ID string is supplied
    }

    if (!targetUserId) {
      return bot.sendMessage(chatId, `❌ **Target Processing Failure:** Recipient user \`${userMention}\` was not located inside player database logs. Ensure they have typed \`/start\` first!`, { parse_mode: "Markdown" });
    }

    const hasNormal = normalCards[cardId] ? true : false;
    const hasMythic = mythicCards[cardId] ? true : false;

    if (!hasNormal && !hasMythic) {
      return bot.sendMessage(chatId, `❌ **Database Query Failure:** \`${cardId}\` matches no asset objects!`, { parse_mode: "Markdown" });
    }

    const buttons = [];
    if (hasNormal) buttons.push({ text: "🟢 Drop Normal", callback_data: `adm_give_${targetUserId}_${cardId}_normal` });
    if (hasMythic) buttons.push({ text: "👑 Drop Mythic", callback_data: `adm_give_${targetUserId}_${cardId}_mythic` });

    await bot.sendMessage(chatId, `🎁 **Inventory Item Discovered:**\nChoose version layout configuration to forcefully drop inside user profile:`, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [buttons] }
    });
  });

  // ==========================================
  // 🤝 3. LEVEL-RESTRICTED SYSTEM TRADING (/tradechar)
  // ==========================================
  bot.onText(/\/tradechar (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const senderId = msg.from.id.toString();

    // Cache local username mapping metadata structures cleanly on interaction
    if (msg.from.username) {
      const p = getPlayer(senderId);
      p.username = msg.from.username;
      savePlayers();
    }

    const input = match[1].split("|").map(item => item.trim());
    if (input.length < 5) {
      return bot.sendMessage(chatId, "❌ **Incorrect Mapping Layout!**\nUse: \`/tradechar @TargetUser | MyCard | MyRarity | TheirCard | TheirRarity\`", { parse_mode: "Markdown" });
    }

    const [targetMention, myCard, myRarity, theirCard, theirRarity] = input;
    const cleanMyRarity = myRarity.toLowerCase();
    const cleanTheirRarity = theirRarity.toLowerCase();

    // 🛑 CRITICAL STEP 1: ENFORCE MATCHING-TIER EXCHANGE BALANCING RULES
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

    const senderOwns = senderProfile.characters.some(c => c.id === myCard && c.rarity === cleanMyRarity);
    const receiverOwns = receiverProfile.characters.some(c => c.id === theirCard && c.rarity === cleanTheirRarity);

    if (!senderOwns) return bot.sendMessage(chatId, `❌ **Aborted:** You do not own \`${myCard} (${cleanMyRarity.toUpperCase()})\`!`, { parse_mode: "Markdown" });
    if (!receiverOwns) return bot.sendMessage(chatId, `❌ **Aborted:** Trading partner does not own \`${theirCard} (${cleanTheirRarity.toUpperCase()})\`!`, { parse_mode: "Markdown" });

    const tradeId = `t_${Date.now()}`;
    activeTrades[tradeId] = {
      sender: senderId,
      receiver: receiverId,
      senderCard: myCard,
      senderRarity: cleanMyRarity,
      receiverCard: theirCard,
      receiverRarity: cleanTheirRarity
    };

    await bot.sendMessage(chatId, `🤝 **Secure Trading Instance Generated!**\n\n👤 **Offer From Sender:** \`${myCard} (${cleanMyRarity.toUpperCase()})\`\n👤 **Requested From Partner:** \`${theirCard} (${cleanTheirRarity.toUpperCase()})\`\n\nDo you authorize this asset swap sequence initialization?`, {
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
  // 🎮 4. GLOBAL INTERACTIVE CALLBACK INTERFACES
  // ==========================================
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const clickerId = query.from.id.toString();
    const data = query.data;

    // Fast Cache tag lookups for runtime instances
    if (query.from.username) {
      const p = getPlayer(clickerId);
      p.username = query.from.username;
      savePlayers();
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

    // MAIN SPECIFICATION AND GRAPHIC DELIVERY PANEL
    if (data.startsWith("vchar_")) {
      const [_, charKey, rarity] = data.split("_");
      const cardData = (rarity === "mythic") ? mythicCards[charKey] : normalCards[charKey];

      if (!cardData) return bot.answerCallbackQuery(query.id, { text: "Database node pointer invalid!", show_alert: true });

      const player = getPlayer(clickerId);
      const ownsCard = player.characters.some(c => c.id === charKey && c.rarity === rarity);
      
      const statusText = ownsCard ? "✅ **Status:** Owned inside profile catalog!" : "❌ **Status:** Unowned configuration node.";
      const rarityTag = rarity === "mythic" ? "👑 MYTHIC" : "🟢 NORMAL";
      
      const captionMessage = `✨ **Character Profile:** ${cardData.name || charKey} (${rarityTag})\n` +
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

    // ADMIN PRIVILEGED DROP EXECUTION CORE ROUTE
    if (data.startsWith("adm_give_")) {
      const [_, __, targetUser, cardId, rarity] = data.split("_");
      const targetDataset = (rarity === "mythic") ? mythicCards : normalCards;

      const player = getPlayer(targetUser);
      const hasCard = player.characters.some(c => c.id === cardId && c.rarity === rarity);

      if (hasCard) {
        return bot.answerCallbackQuery(query.id, { text: "Aborted: Recipient profile holds this configuration card layer already.", show_alert: true });
      }

      player.characters.push({ id: cardId, rarity: rarity, name: targetDataset[cardId].name });
      savePlayers();

      bot.answerCallbackQuery(query.id, { text: "Card dropped successfully!" });
      await bot.sendMessage(chatId, `🎁 **Administrative Data Injection Completed Successfully!**\n\nDropped **${targetDataset[cardId].name} (${rarity.toUpperCase()})** directly inside user file repository structure!`, { parse_mode: "Markdown" });
      
      const cardImage = targetDataset[cardId].img || targetDataset[cardId].image;
      if (cardImage && cardImage.startsWith("http")) {
        return bot.sendPhoto(chatId, cardImage, { caption: `✨ **Acquired Item Render Layout File:**\nCard Name: ${targetDataset[cardId].name} (${rarity.toUpperCase()})` });
      }
    }

    // TRADE AUTHORIZATION AGREEMENT LOGIC PROCESS ROUTE
    if (data.startsWith("t_acc_")) {
      const tradeId = data.replace("t_acc_", "");
      const trade = activeTrades[tradeId];

      if (!trade) return bot.answerCallbackQuery(query.id, { text: "Session tracking instance expired.", show_alert: true });
      if (clickerId !== trade.receiver) return bot.answerCallbackQuery(query.id, { text: "Unauthorized system mapping. You are not the transaction recipient target!", show_alert: true });

      const senderProfile = getPlayer(trade.sender);
      const receiverProfile = getPlayer(trade.receiver);

      const sIndex = senderProfile.characters.findIndex(c => c.id === trade.senderCard && c.rarity === trade.senderRarity);
      const rIndex = receiverProfile.characters.findIndex(c => c.id === trade.receiverCard && c.rarity === trade.receiverRarity);

      if (sIndex === -1 || rIndex === -1) {
        delete activeTrades[tradeId];
        return bot.sendMessage(chatId, "❌ **Transaction Processing Fault:** Structural integrity failure. Target components shifted state records prior to finalize lock.");
      }

      // Atomic data field transformation execution processing setup
      const [sCard] = senderProfile.characters.splice(sIndex, 1);
      const [rCard] = receiverProfile.characters.splice(rIndex, 1);

      senderProfile.characters.push(rCard);
      receiverProfile.characters.push(sCard);

      savePlayers();
      delete activeTrades[tradeId];

      bot.answerCallbackQuery(query.id);
      await bot.sendMessage(chatId, `🎉 **The trade is completed successfully!**\n\nSecure structural item node transactions are confirmed saved. Check inventory balances to observe item mutations.`);
      
      // Output rendering layouts for swapped properties cleanly post-completion
      const sData = (trade.senderRarity === "mythic" ? mythicCards : normalCards)[trade.senderCard];
      if (sData && (sData.img || sData.image)) {
        await bot.sendPhoto(chatId, sData.img || sData.image, { caption: `✅ **Transferred Node Visual Array File:** ${sData.name}` });
      }
    }

    // TRADE REFUSAL CANCEL PROCESS ROUTE
    if (data.startsWith("t_dec_")) {
      const tradeId = data.replace("t_dec_", "");
      const trade = activeTrades[tradeId];

      if (!trade) return bot.answerCallbackQuery(query.id, { text: "Session expired.", show_alert: true });
      if (clickerId !== trade.receiver && clickerId !== trade.sender) return bot.answerCallbackQuery(query.id, { text: "Unauthorized operation interaction vector.", show_alert: true });

      delete activeTrades[tradeId];
      bot.answerCallbackQuery(query.id);
      return bot.sendMessage(chatId, "❌ **Trade transaction request was cancelled successfully.**");
    }
  });
};