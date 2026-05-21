console.log("✅ CHARACTER REGISTRY SYSTEM LOADED");

const fs = require("fs");
const path = require("path");

const playerFile = path.join(__dirname, "../data/players.json");
const charFile = path.join(__dirname, "../data/characters.json");

// ADMIN TELEGRAM USER ID CHECK
const ADMIN_ID = "2086993762";

// LOAD DATA SAFE MATRIX
let players = {};
let globalCharacters = [];

try { players = JSON.parse(fs.readFileSync(playerFile, "utf8")); } catch { players = {}; }
try { globalCharacters = JSON.parse(fs.readFileSync(charFile, "utf8")); } catch { globalCharacters = []; }

// SAVE ACTIONS
const savePlayers = () => fs.writeFileSync(playerFile, JSON.stringify(players, null, 2));
const saveCharacters = () => fs.writeFileSync(charFile, JSON.stringify(globalCharacters, null, 2));

module.exports = (bot) => {

  // ==========================================
  // CODE 1: /addchar [ADMIN MASTER CONTROLLER]
  // ==========================================
  // Syntax format: /addchar Name | Image_URL | Type/Tier
  bot.onText(/\/addchar (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    // Security layer check
    if (userId !== ADMIN_ID) {
      return bot.sendMessage(chatId, "❌ Unauthorized Access! Only the Head Slayer can add global characters.");
    }

    const input = match[1];
    const parts = input.split("|");

    if (parts.length < 3) {
      return bot.sendMessage(
        chatId,
        "❌ **Incorrect Syntax Format!**\n\nUse: `/addchar Name | ImageURL | Type` \nExample: `/addchar Tanjiro Kamado | https://url.com/pic.jpg | Sun Breathing`",
        { parse_mode: "Markdown" }
      );
    }

    const name = parts[0].trim();
    const image = parts[1].trim();
    const type = parts[2].trim();

    // Reload live to make sure we don't overwrite other data mutations
    try { globalCharacters = JSON.parse(fs.readFileSync(charFile, "utf8")); } catch { globalCharacters = []; }

    // Check if duplicate entry exists
    const duplicate = globalCharacters.find(c => c.name.toLowerCase() === name.toLowerCase() && c.type.toLowerCase() === type.toLowerCase());
    if (duplicate) {
      return bot.sendMessage(chatId, `⚠️ **${name} (${type})** is already registered inside the global system database.`);
    }

    // Build standard dictionary entry format
    const newChar = { name, image, type };
    globalCharacters.push(newChar);
    saveCharacters();

    bot.sendMessage(
      chatId,
      `✅ **New Character Successfully Added to Server Global Data!**\n\n⚔️ **Name:** ${name}\n📁 **Type/Breath:** ${type}\n🖼 **Image Registered Securely.**`,
      { parse_mode: "Markdown" }
    );
  });


  // ==========================================
  // CODE 2: /char VIEW & SEARCH SYSTEMS
  // ==========================================
  bot.onText(/\/char(?: (.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const query = (match[1] || "").toLowerCase().trim();

    // Load active file state live
    try { globalCharacters = JSON.parse(fs.readFileSync(charFile, "utf8")); } catch { globalCharacters = []; }

    if (globalCharacters.length === 0) {
      return bot.sendMessage(chatId, "❌ There are no characters populated inside the bot database yet.");
    }

    // Case A: If user typed simply `/char`, list all items inside the global registry database
    if (!query) {
      let text = "📦 **Global Character Index**\n\n";
      globalCharacters.forEach(c => {
        text += `⚔️ **${c.name}** (${c.type})\n`;
      });
      text += "\nℹ️ *Type `/char [name]` to view full card stats artwork!*";
      return bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }

    // Case B: Filter search results based on user input
    const results = globalCharacters.filter(c => c.name.toLowerCase().includes(query));

    if (results.length === 0) {
      return bot.sendMessage(chatId, `❌ No character matching "**${query}**" found in our database system.`);
    }

    // If exactly 1 single matching character variant found, send card layout directly
    if (results.length === 1) {
      const c = results[0];
      return bot.sendPhoto(chatId, c.image, {
        caption: `⚔️ **Name:** ${c.name}\n📁 **Style/Breathing Type:** ${c.type}`,
        parse_mode: "Markdown"
      });
    }

    // Case C: Multiple results found (e.g. searching "Tanjiro" returns water version & sun version) -> Build button selector
    let buttons = [];
    results.forEach(c => {
      buttons.push([
        {
          text: `${c.name} (${c.type})`,
          callback_data: `char|${c.name}|${c.type}`
        }
      ]);
    });

    bot.sendMessage(chatId, "🔎 **Multiple character variants found. Select version below:**", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  });


  // ==========================================
  // CODE 3: INLINE SELECTOR INTERACTION HANDLER
  // ==========================================
  bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (!data.startsWith("char|")) return;

    const [, name, type] = data.split("|");

    // Load fresh file reference
    try { globalCharacters = JSON.parse(fs.readFileSync(charFile, "utf8")); } catch { globalCharacters = []; }

    const char = globalCharacters.find(c => c.name === name && c.type === type);

    if (!char) {
      return bot.sendMessage(chatId, "❌ Character record not found.");
    }

    bot.sendPhoto(chatId, char.image, {
      caption: `⚔️ **Name:** ${char.name}\n📁 **Style/Breathing Type:** ${char.type}`,
      parse_mode: "Markdown"
    });

    bot.answerCallbackQuery(query.id);
  });

};
