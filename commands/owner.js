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

const getPlayer = (id) => {
  if (!players[id]) {
    players[id] = { coins: 0, mythicalCrystals: 0, inventory: [], level: 1, xp: 0 };
    saveAll();
  }
  if (!players[id].inventory) players[id].inventory = [];
  return players[id];
};

// Username se UserID nikalne ka helper
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
                 `💰 \`/removecoins ID AMOUNT\`\n` +
                 `💎 \`/addtokens ID AMOUNT\`\n` +
                 `💎 \`/removetokens ID AMOUNT\`\n\n` +
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
      return bot.sendMessage(msg.chat.id, "❌ **Format Error:** Use structural configuration: `/addcharacter @username tanjiro`", { parse_mode: "Markdown" });
    }

    const [userTarget, cardKeyInput] = parts;
    const cardId = cardKeyInput.toLowerCase().replace(/\s+/g, "_");

    // Resolve Target User ID
    let targetUserId = resolveUserByTag(userTarget);
    if (!targetUserId && !isNaN(userTarget.replace("@", ""))) {
      targetUserId = userTarget.replace("@", "");
    }

    if (!targetUserId) {
      return bot.sendMessage(msg.chat.id, `❌ **User Not Found:** \`${userTarget}\` ka data register nahi mila.`, { parse_mode: "Markdown" });
    }

    // Check if card exists in either DB
    const hasNormal = normalCards[cardId] ? true : false;
    const hasMythic = mythicCards[cardId] ? true : false;

    if (!hasNormal && !hasMythic) {
      return bot.sendMessage(msg.chat.id, `❌ **Database Error:** \`${cardId}\` naam ka koi character assets me nahi mila!`, { parse_mode: "Markdown" });
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

      // Push exactly to user's database string template profile
      p.inventory.push(`${uniqueCharId}|${cardName}|${cardImage}|${cardType}`);
      saveAll();

      bot.answerCallbackQuery(query.id, { text: "Card Transferred!" });
      
      // Delete button menu to avoid double-clicking
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
  // 🪙 REST OF COIN & UTILITY COMMANDS (SAME)
  // ==========================================
  bot.onText(/\/addcoins (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const p = getPlayer(match[1]);
    p.coins += parseInt(match[2], 10);
    saveAll();
    bot.sendMessage(msg.chat.id, `✅ Added ${parseInt(match[2], 10).toLocaleString()} Coins`);
  });

 bot.onText(/\/resetcoins/, async (msg) => {
    // Sirf admin hi chala paye (Tumhari ID)
    if (msg.from.id.toString() !== "2086993762") return; 

    const path = require("path");
    const fs = require("fs");
    const playerFile = path.join(__dirname, "../data/players.json");

    try {
        if (fs.existsSync(playerFile)) {
            // 1. Pura database read karo (Sare players ka data memory mein aayega)
            let players = JSON.parse(fs.readFileSync(playerFile, "utf8"));
            const userId = "2086993762"; // Tumhari ID

            if (players[userId]) {
                // 2. Sirf TUMHARE coins 0 kiye, baki players ka kuch touch nahi hua
                players[userId].coins = 0; 
                
                // 3. Wapas file mein hard-save kar diya
                fs.writeFileSync(playerFile, JSON.stringify(players, null, 2), "utf8");
                
                await bot.sendMessage(msg.chat.id, "✅ Aapke coins safely 0 kar diye gaye hain. Baki players ka data bilkul safe hai!");
            } else {
                await bot.sendMessage(msg.chat.id, "❌ Player data nahi mila.");
            }
        }
    } catch (err) {
        console.error("Error resetting coins:", err);
    }
}); 

  bot.onText(/\/addtokens (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const p = getPlayer(match[1]);
    p.mythicalCrystals += parseInt(match[2], 10);
    saveAll();
    bot.sendMessage(msg.chat.id, "✅ Tokens added");
  });

  bot.onText(/\/removetokens (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const p = getPlayer(match[1]);
    p.mythicalCrystals = Math.max(0, (p.mythicalCrystals || 0) - parseInt(match[2], 10));
    saveAll();
    bot.sendMessage(msg.chat.id, "✅ Tokens removed");
  });

  bot.onText(/\/removecharacter (\d+) (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const p = getPlayer(match[1]);
    const targetCharId = match[2].trim();
    p.inventory = p.inventory.filter(item => !item.startsWith(targetCharId + "|"));
    saveAll();
    bot.sendMessage(msg.chat.id, "🗑️ Character removed from inventory.");
  });

  bot.onText(/\/checkplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    const targetId = match[1];
    if (!players[targetId]) return bot.sendMessage(msg.chat.id, "❌ User not found.");
    const p = players[targetId];
    bot.sendMessage(msg.chat.id, `👤 **Player Specs [${targetId}]:**\n\n🪙 Coins: ${p.coins}\n💎 Crystals: ${p.mythicalCrystals}\n📦 Inventory Size: ${p.inventory.length}`);
  });

  bot.onText(/\/resetplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;
    delete players[match[1]];
    saveAll();
    bot.sendMessage(msg.chat.id, "🔄 Player reset done");
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
      bot.sendMessage(msg.chat.id, "❌ Guild not found.");
    }
  });
};