const players = require("../data/players");

// =========================
// GET CHARACTERS FROM OWNER STORAGE
// =========================
const getCharacters = () => {
  const owner = players["2086993762"];

  if (!owner || !owner.inventory) return [];

  return owner.inventory.map(c => {
    const [name, image, type] = c.split("|");
    return { name, image, type };
  });
};

module.exports = (bot) => {

  // =========================
  // /char SEARCH (BUTTON SYSTEM)
  // =========================
  bot.onText(/\/char(?: (.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const query = (match[1] || "").toLowerCase().trim();

    const chars = getCharacters();

    // if no input → list all
    if (!query) {
      let text = "📦 *All Characters*\n\n";

      chars.forEach(c => {
        text += `⚔️ ${c.name} (${c.type})\n`;
      });

      return bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
    }

    // SEARCH
    const results = chars.filter(c =>
      c.name.toLowerCase().includes(query)
    );

    if (results.length === 0) {
      return bot.sendMessage(chatId, "❌ No character found");
    }

    // group by name
    const groups = {};

    results.forEach(c => {
      if (!groups[c.name]) groups[c.name] = [];
      groups[c.name].push(c);
    });

    // if only 1 result → direct send
    if (results.length === 1) {
      const c = results[0];

      return bot.sendPhoto(chatId, c.image, {
        caption: `⚔️ ${c.name}\n📁 ${c.type}`
      });
    }

    // =========================
    // MULTIPLE RESULTS → BUTTONS
    // =========================
    let buttons = [];

    Object.keys(groups).forEach(name => {
      groups[name].forEach(c => {
        buttons.push([
          {
            text: `${c.name} (${c.type})`,
            callback_data: `char|${c.name}|${c.type}`
          }
        ]);
      });
    });

    bot.sendMessage(chatId, "🔎 Select Character Version:", {
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  });

  // =========================
  // BUTTON HANDLER
  // =========================
  bot.on("callback_query", (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    if (!data.startsWith("char|")) return;

    const [, name, type] = data.split("|");

    const chars = getCharacters();

    const char = chars.find(
      c => c.name === name && c.type === type
    );

    if (!char) {
      return bot.sendMessage(chatId, "❌ Character not found");
    }

    bot.sendPhoto(chatId, char.image, {
      caption: `⚔️ ${char.name}\n📁 ${char.type}`
    });

    bot.answerCallbackQuery(query.id);
  });

};
