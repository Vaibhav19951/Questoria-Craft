console.log("⚙️ VELIX MASTER CONTROL ENGINE INITIALIZED (V2.5 ARCHITECTURE)");

const fs = require("fs");
const path = require("path");

const playersPath = path.join(__dirname, "../data/players.json");
const guildsPath = path.join(__dirname, "../data/guild.json");

// Pull existing card databases seamlessly
const { characters: normalCards } = require("../asset/assets.js");
const { mythical: mythicCards } = require("../asset/mythical.js");

let players = {};
let guilds = {};

try {
  if (!fs.existsSync(path.dirname(playersPath))) fs.mkdirSync(path.dirname(playersPath), { recursive: true });
  if (!fs.existsSync(playersPath)) fs.writeFileSync(playersPath, JSON.stringify({}), "utf8");
  if (!fs.existsSync(guildsPath)) fs.writeFileSync(guildsPath, JSON.stringify({}), "utf8");

  players = JSON.parse(fs.readFileSync(playersPath, "utf8"));
  guilds = JSON.parse(fs.readFileSync(guildsPath, "utf8"));
} catch (e) {
  console.log("⚠️ Error loading JSON bases inside owner.js:", e.message);
}

const saveAll = () => {
  fs.writeFileSync(playersPath, JSON.stringify(players, null, 2), "utf8");
  fs.writeFileSync(guildsPath, JSON.stringify(guilds, null, 2), "utf8");
};

const OWNER_ID = "2086993762";
const isOwner = (msg) => msg.from.id.toString() === OWNER_ID;

// Target player constructor map aligning to profile system architecture
const getPlayer = (id) => {
  if (!players[id]) {
    players[id] = { coins: 0, crystals: 0, mythic: 0, level: 1, exp: 0, inventory: [] };
    saveAll();
  }
  // Data structural maintenance checks
  if (!players[id].inventory) players[id].inventory = [];
  if (players[id].mythicalCrystals !== undefined) { 
    // Legacy schema clean-up redirect pipeline if database structure holds old variables
    players[id].mythic = Number(players[id].mythic || 0) + Number(players[id].mythicalCrystals || 0);
    delete players[id].mythicalCrystals;
    saveAll();
  }
  return players[id];
};

const resolveUserByTag = (mentionStr) => {
  const cleanTag = mentionStr.replace("@", "").trim().toLowerCase();
  for (const [id, profile] of Object.entries(players)) {
    if (profile.username && profile.username.toLowerCase() === cleanTag) {
      return id;
    }
  }
  return null;
};

module.exports = (bot) => {

  const registerUsername = (msg) => {
    if (msg.from && msg.from.username) {
      const p = getPlayer(msg.from.id.toString());
      p.username = msg.from.username;
      saveAll();
    }
  };

  // ==========================================
  // 👑 MAIN OWNER PANEL VIEW
  // ==========================================
  bot.onText(/\/owner/, (msg) => {
    if (!isOwner(msg)) return;
    registerUsername(msg);
    
    bot.sendAnimation(
      msg.chat.id,
      "https://i.pinimg.com/originals/e2/f7/45/e2f745698b639d14dbd4c1567e5f03d6.gif",
      {
        caption: `👑 **VELIX MASTER ARCHITECT CONTROL MATRIX**\n\n` +
                 `💰 \`/addcoins ID AMOUNT\`\n` +
                 `💰 \`/removecoins ID AMOUNT\`\n\n` +
                 `💎 \`/addcrystals ID AMOUNT\`\n` +
                 `💎 \`/removecrystals ID AMOUNT\`\n\n` +
                 `✨ \`/addtokens ID AMOUNT\`\n` +
                 `✨ \`/removetokens ID AMOUNT\`\n\n` +
                 `🧬 \`/addcharacter @user/ID card_id\`\n` +
                 `🗑️ \`/removecharacter USERID CharacterID\`\n\n` +
                 `👤 \`/checkplayer ID\`\n` +
                 `🔄 \`/resetplayer ID\`\n\n` +
                 `🏰 \`/deleteguild GUILD_ID_OR_NAME\``,
        parse_mode: "Markdown"
      }
    );
  });

  bot.onText(/\/myid/, (msg) => bot.sendMessage(msg.chat.id, `🆔 \`${msg.from.id}\``, { parse_mode: "Markdown" }));

  // ==========================================
  // 🧬 DYNAMIC DB CHARACTER ADD PANEL
  // ==========================================
  bot.onText(/\/addcharacter (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    registerUsername(msg);

    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) {
      return bot.sendMessage(msg.chat.id, "❌ **Format Error:** Use structure: \`/addcharacter @username tanjiro\`", { parse_mode: "Markdown" });
    }

    const [userTarget, cardKeyInput] = parts;
    const cardId = cardKeyInput.toLowerCase().replace(/\s+/g, "_");

    let targetUserId = resolveUserByTag(userTarget);
    if (!targetUserId && !isNaN(userTarget.replace("@", ""))) {
      targetUserId = userTarget.replace("@", "");
    }

    if (!targetUserId) {
      return bot.sendMessage(msg.chat.id, `❌ **User Not Found:** \`${userTarget}\` registration context missing.`, { parse_mode: "Markdown" });
    }

    const hasNormal = normalCards[cardId] ? true : false;
    const hasMythic = mythicCards[cardId] ? true : false;

    if (!hasNormal && !hasMythic) {
      return bot.sendMessage(msg.chat.id, `❌ **Database Error:** \`${cardId}\` not found inside assets.`, { parse_mode: "Markdown" });
    }

    const buttons = [];
    if (hasNormal) buttons.push({ text: "🟢 Drop Normal", callback_data: `own_drop_${targetUserId}_${cardId}_normal` });
    if (hasMythic) buttons.push({ text: "👑 Drop Mythical", callback_data: `own_drop_${targetUserId}_${cardId}_mythic` });

    bot.sendMessage(msg.chat.id, `🎁 **Character Options Found:**\nChoose rarity level to transfer to \`${userTarget}\`:`, {
      parse_mode: "Markdown",
      reply_markup: { inline_keyboard: [buttons] }
    });
  });

  // ==========================================
  // 🔄 CALLBACK BUTTON HANDLER
  // ==========================================
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const clickerId = query.from.id.toString();
    const data = query.data;

    if (clickerId !== OWNER_ID) {
      return bot.answerCallbackQuery(query.id, { text: "Access Denied!", show_alert: true });
    }

    if (data.startsWith("own_drop_")) {
      const [_, __, targetUser, cardId, rarity] = data.split("_");
      const targetDataset = (rarity === "mythic") ? mythicCards : normalCards;
      const cardData = targetDataset[cardId];

      if (!cardData) {
        return bot.answerCallbackQuery(query.id, { text: "Card data error in DB!", show_alert: true });
      }

      const p = getPlayer(targetUser);
      const uniqueCharId = "c" + Date.now();
      
      const cardName = cardData.name || cardId;
      const cardImage = cardData.img || cardData.image || cardData.url;
      const cardType = cardData.type || rarity.toUpperCase();

      p.inventory.push(`${uniqueCharId}|${cardName}|${cardImage}|${cardType}`);
      saveAll();

      bot.answerCallbackQuery(query.id, { text: "Card Transferred!" });
      bot.deleteMessage(chatId, query.message.message_id).catch(() => {});

      const successCaption = `🎉 **The trade is completed successfully!**\n\n` +
                             `🎁 **Transferred to User:** \`${targetUser}\`\n` +
                             `🔖 **Name:** ${cardName}\n` +
                             `👑 **Rarity/Type:** ${cardType}\n` +
                             `🆔 **Unique ID:** \`${uniqueCharId}\``;

      if (cardImage && cardImage.startsWith("http")) {
        return bot.sendPhoto(chatId, cardImage, { caption: successCaption, parse_mode: "Markdown" });
      } else {
        return bot.sendMessage(chatId, successCaption, { parse_mode: "Markdown" });
      }
    }
  });

  // ==========================================
  // 🪙 COINS MODIFICATION COMMANDS
  // ==========================================
  bot.onText(/\/addcoins (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) return bot.sendMessage(msg.chat.id, "❌ **Syntax:** `/addcoins USER_ID AMOUNT`");

    const targetId = parts[0];
    const amount = parseInt(parts[1], 10);
    if (isNaN(amount)) return bot.sendMessage(msg.chat.id, "❌ Invalid amount value.");

    const p = getPlayer(targetId);
    p.coins += amount;
    saveAll();
    bot.sendMessage(msg.chat.id, `✅ Added ${amount.toLocaleString()} Coins. New Balance: ${p.coins.toLocaleString()}`);
  });

  bot.onText(/\/removecoins (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) return bot.sendMessage(msg.chat.id, "❌ **Syntax:** `/removecoins USER_ID AMOUNT`");

    const targetId = parts[0];
    const amount = parseInt(parts[1], 10);
    if (isNaN(amount)) return bot.sendMessage(msg.chat.id, "❌ Invalid amount value.");

    const p = getPlayer(targetId);
    p.coins = Math.max(0, p.coins - amount);
    saveAll();
    bot.sendMessage(msg.chat.id, `🔻 Removed ${amount.toLocaleString()} Coins. New Balance: ${p.coins.toLocaleString()}`);
  });

  bot.onText(/\/resetcoins/, async (msg) => {
    if (!isOwner(msg)) return; 
    const p = getPlayer(OWNER_ID);
    p.coins = 0; 
    saveAll();
    await bot.sendMessage(msg.chat.id, "✅ Aapke coins safely 0 kar diye gaye hain. Baki players ka data bilkul safe hai!");
  }); 

  // ==========================================
  // 💎 CRYSTALS MODIFICATION COMMANDS
  // ==========================================
  bot.onText(/\/addcrystals (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) return bot.sendMessage(msg.chat.id, "❌ **Syntax:** `/addcrystals USER_ID AMOUNT`");

    const targetId = parts[0];
    const amount = parseInt(parts[1], 10);
    if (isNaN(amount)) return bot.sendMessage(msg.chat.id, "❌ Invalid amount value.");

    const p = getPlayer(targetId);
    p.crystals = Number(p.crystals || 0) + amount;
    saveAll();
    bot.sendMessage(msg.chat.id, `💎 **Added:** \`+${amount.toLocaleString()} Crystals\`\n📊 **Balance:** \`${p.crystals.toLocaleString()} Crystals\``, { parse_mode: "Markdown" });
  });

  bot.onText(/\/removecrystals (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) return bot.sendMessage(msg.chat.id, "❌ **Syntax:** `/removecrystals USER_ID AMOUNT`");

    const targetId = parts[0];
    const amount = parseInt(parts[1], 10);
    if (isNaN(amount)) return bot.sendMessage(msg.chat.id, "❌ Invalid amount value.");

    const p = getPlayer(targetId);
    p.crystals = Math.max(0, Number(p.crystals || 0) - amount);
    saveAll();
    bot.sendMessage(msg.chat.id, `🛡 **Removed:** \`-${amount.toLocaleString()} Crystals\`\n📊 **Balance:** \`${p.crystals.toLocaleString()} Crystals\``, { parse_mode: "Markdown" });
  });

  // ==========================================
  // ✨ MYTHICAL TOKENS MODIFICATION COMMANDS
  // ==========================================
  bot.onText(/\/addtokens (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) return bot.sendMessage(msg.chat.id, "❌ **Syntax:** `/addtokens USER_ID AMOUNT`");

    const targetId = parts[0];
    const amount = parseInt(parts[1], 10);
    if (isNaN(amount)) return bot.sendMessage(msg.chat.id, "❌ Invalid amount value.");

    const p = getPlayer(targetId);
    p.mythic = Number(p.mythic || 0) + amount;
    saveAll();
    bot.sendMessage(msg.chat.id, `✨ **Added:** \`+${amount.toLocaleString()} Mythical Tokens\`\n📊 **Balance:** \`${p.mythic.toLocaleString()} Mythic Tokens\``, { parse_mode: "Markdown" });
  });

  bot.onText(/\/removetokens (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) return bot.sendMessage(msg.chat.id, "❌ **Syntax:** `/removetokens USER_ID AMOUNT`");

    const targetId = parts[0];
    const amount = parseInt(parts[1], 10);
    if (isNaN(amount)) return bot.sendMessage(msg.chat.id, "❌ Invalid amount value.");

    const p = getPlayer(targetId);
    p.mythic = Math.max(0, Number(p.mythic || 0) - amount);
    saveAll();
    bot.sendMessage(msg.chat.id, `🛡 **Removed:** \`-${amount.toLocaleString()} Mythical Tokens\`\n📊 **Balance:** \`${p.mythic.toLocaleString()} Mythic Tokens\``, { parse_mode: "Markdown" });
  });

  // ==========================================
  // 📦 INVENTORY & UTILITIES
  // ==========================================
  bot.onText(/\/removecharacter (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const parts = match[1].trim().split(/\s+/);
    if (parts.length < 2) return bot.sendMessage(msg.chat.id, "❌ **Syntax:** `/removecharacter USER_ID CHARACTER_ID`");

    const targetId = parts[0];
    const targetCharId = parts[1].trim();

    const p = getPlayer(targetId);
    p.inventory = p.inventory.filter(item => !item.startsWith(targetCharId + "|"));
    saveAll();
    bot.sendMessage(msg.chat.id, "🗑️ Character removed from inventory.");
  });

  bot.onText(/\/checkplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const targetId = match[1];
    if (!players[targetId]) return bot.sendMessage(msg.chat.id, "❌ User database snapshot missing.");
    const p = players[targetId];
    bot.sendMessage(msg.chat.id, `👤 **Player Specs [${targetId}]:**\n\n🪙 Coins: ${Number(p.coins || 0).toLocaleString()}\n💎 Crystals: ${Number(p.crystals || 0).toLocaleString()}\n✨ Mythic Tokens: ${Number(p.mythic || 0).toLocaleString()}\n📦 Inventory Size: ${p.inventory.length} items`);
  });

  bot.onText(/\/resetplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    delete players[match[1]];
    saveAll();
    bot.sendMessage(msg.chat.id, "🔄 Player structural wipe complete.");
  });

  bot.onText(/\/deleteguild (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const target = match[1].trim();
    if (guilds[target]) {
      delete guilds[target];
      saveAll();
      return bot.sendMessage(msg.chat.id, "🏰 Guild deleted via key.");
    }
    let found = null;
    for (const [id, data] of Object.entries(guilds)) {
      if (data.name && data.name.toLowerCase() === target.toLowerCase()) { found = id; break; }
    }
    if (found) {
      delete guilds[found];
      saveAll();
      bot.sendMessage(msg.chat.id, "🏰 Guild deleted via name.");
    } else {
      bot.sendMessage(msg.chat.id, "❌ Guild entry target not tracked.");
    }
  });
};
