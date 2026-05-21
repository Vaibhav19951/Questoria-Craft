console.log("✅ UPGRADED CHARACTER SYSTEM LOADED (WITH IDs)");

const fs = require("fs");
const path = require("path");

const playerFile = path.join(__dirname, "../data/players.json");
const charFile = path.join(__dirname, "../data/characters.json");

// ADMIN ID CHECK
const ADMIN_ID = "2086993762";

// LOAD DATA SAFELY
let globalCharacters = [];
try { globalCharacters = JSON.parse(fs.readFileSync(charFile, "utf8")); } catch { globalCharacters = []; }

// SAVE ACTIONS
const saveCharacters = () => fs.writeFileSync(charFile, JSON.stringify(globalCharacters, null, 2));

module.exports = (bot) => {

  // ==========================================
  // 🔨 /addchar [ADMIN MASTER CONTROLLER]
  // ==========================================
  // Syntax format: /addchar ID | Name | Image_URL | Type
  bot.onText(/\/addchar (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (userId !== ADMIN_ID) {
      return bot.sendMessage(chatId, "❌ Unauthorized Access! Only the Head Slayer can add global characters.");
    }

    const input = match[1];
    const parts = input.split("|");

    if (parts.length < 4) {
      return bot.sendMessage(
        chatId,
        "❌ **Incorrect Syntax Format!**\n\nUse: `/addchar ID | Name | ImageURL | Type` \nExample: `/addchar 001 | Tanjiro Kamado | https://url.com/pic.jpg | Water Breathing`",
        { parse_mode: "Markdown" }
      );
    }

    const id = parts[0].trim();
    const name = parts[1].trim();
    const image = parts[2].trim();
    const type = parts[3].trim();

    try { globalCharacters = JSON.parse(fs.readFileSync(charFile, "utf8")); } catch { globalCharacters = []; }

    // Check if ID or Name is already taken
    const duplicate = globalCharacters.find(c => c.id === id || (c.name.toLowerCase() === name.toLowerCase() && c.type.toLowerCase() === type.toLowerCase()));
    if (duplicate) {
      return bot.sendMessage(chatId, `⚠️ An entry with ID **${id}** or Name **${name}** already exists!`);
    }

    const newChar = { id, name, image, type };
    globalCharacters.push(newChar);
    saveCharacters();

    bot.sendMessage(
      chatId,
      `✅ **Character Registered Securely!**\n\n🆔 **ID:** ${id}\n⚔️ **Name:** ${name}\n📁 **Type:** ${type}\n🖼 **Image Saved Perfectly.**`,
      { parse_mode: "Markdown" }
    );
  });


  // ==========================================
  // 📦 /char (LIST ALL SYSTEMS)
  // ==========================================
  bot.onText(/\/char$/, (msg) => {
    const chatId = msg.chat.id;

    try { globalCharacters = JSON.parse(fs.readFileSync(charFile, "utf8")); } catch { globalCharacters = []; }

    if (globalCharacters.length === 0) {
      return bot.sendMessage(chatId, "❌ No characters found inside the database.");
    }

    let text = "📦 **All Registered Characters**\n\n";
    globalCharacters.forEach(c => {
      text += `🆔 \`${c.id}\` \n⚔️ **${c.name}** (${c.type})\n\n`;
    });

    text += "ℹ️ *Type `/char [name]` or `/char [id]` to view details and image card!*";

    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  });


  // ==========================================
  // 🔎 /char [SEARCH BY NAME OR ID WITH BUTTONS]
  // ==========================================
  bot.onText(/\/char (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1].toLowerCase().trim();

    try { globalCharacters = JSON.parse(fs.readFileSync(charFile, "utf8")); } catch { globalCharacters = []; }

    if (globalCharacters.length === 0) {
      return bot.sendMessage(chatId, "❌ No characters found inside the database.");
    }

    // Search by matching either ID or Name
    const results = globalCharacters.filter(c => 
      c.id.toLowerCase() === query || 
      c.name.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      return bot.sendMessage(chatId, `❌ No character found matching "**${match[1]}**".`);
    }

    // If exactly 1 single matching character variant found, send photo card layout directly
    if (results.length === 1) {
      const c = results[0];
      return bot.sendPhoto(chatId, c.image, {
        caption: `🆔 **ID:** \`${c.id}\`\n⚔️ **Name:** ${c.name}\n📁 **Style Type:** ${c.type}`,
        parse_mode: "Markdown"
      });
    }

    // Multiple results found -> Build button selectors
    let buttons = [];
    results.forEach(c => {
      buttons.push([
        {
          text: `🆔 ${c.id} - ${c.name} (${c.type})`,
          callback_data: `char_id|${c.id}`
        }
      ]);
    });

    bot.sendMessage(chatId, "🔎 **Multiple character matches found. Select version below:**", {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  });


  // ==========================================
  // 🔘 INLINE SELECTOR HANDLER
  // ==========================================
  bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (!data.startsWith("char_id|")) return;

    const [, id] = data.split("|");

    try { globalCharacters = JSON.parse(fs.readFileSync(charFile, "utf8")); } catch { globalCharacters = []; }

    const char = globalCharacters.find(c => c.id === id);

    if (!char) {
      return bot.sendMessage(chatId, "❌ Character record not found.");
    }

    bot.sendPhoto(chatId, char.image, {
      caption: `🆔 **ID:** \`${char.id}\`\n⚔️ **Name:** ${char.name}\n📁 **Style Type:** ${char.type}`,
      parse_mode: "Markdown"
    });

    bot.answerCallbackQuery(query.id);
  });

};
