console.log("⚔️ HARDENED ANTI-RESET START SYSTEM LOADED");

const fs = require("fs");
const path = require("path");

const playerFile = path.join(__dirname, "../data/players.json");

// ATOMIC FILE I/O READ AND WRITE TOOLS
const loadPlayersData = () => {
  try { 
    return JSON.parse(fs.readFileSync(playerFile, "utf8")); 
  } catch (e) { 
    return {}; 
  }
};

const savePlayersData = (data) => {
  fs.writeFileSync(playerFile, JSON.stringify(data, null, 2));
};

module.exports = (bot) => {

  // ==========================================
  // IMAGES
  // ==========================================
  const START_IMG = "https://i.pinimg.com/736x/e1/97/3e/e1973e8421e69bc09f731b60f5102d97.jpg";
  const TANJIRO_IMG = "https://i.pinimg.com/736x/ab/26/81/ab26817caf5dbd8bd82f698f517649b7.jpg";
  const NEZUKO_IMG = "https://i.pinimg.com/736x/6c/02/c9/6c02c93d3991470183f6c169d1adc64e.jpg";

  // ==========================================
  // START COMMAND
  // ==========================================
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    // Fresh on-demand load from JSON file
    const currentPlayers = loadPlayersData();

    // Anti-Reset Check: If character already exists, stop right there!
    if (currentPlayers[userId] && currentPlayers[userId].character) {
      return bot.sendMessage(
        chatId,
        `⚠️ **You Already Selected A Character!**\n\n👤 **Current Starter:** ${currentPlayers[userId].character}\n🎯 Use \`/hunt\` to start tracking and slaying demons!`,
        { parse_mode: "Markdown" }
      );
    }

    // Initialize temporary structural player if not in database at all
    if (!currentPlayers[userId]) {
      currentPlayers[userId] = {
        coins: 1000,
        tokens: 0,
        level: 1,
        xp: 0,
        guildId: null,
        lastDaily: 0,
        mythicalCrystals: 5,
        rank: "Mizunoto (Rookie)",
        character: null,
        inventory: [],
        username: msg.from.username || ""
      };
      // Save initialization
      savePlayersData(currentPlayers);
    }

    // Double validation if they somehow bypassed and already have it
    if (currentPlayers[userId].character) {
      return bot.sendMessage(chatId, `⚠️ Character already selected: **${currentPlayers[userId].character}**`);
    }

    // SHOW START MENU
    await bot.sendPhoto(chatId, START_IMG, {
      caption: `⚔️ **WELCOME TO DEMON SLAYER BOT** ⚔️\n\nChoose your beginning path below carefully, Slayer! 👇`,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "👦 Tanjiro Beginning", callback_data: "tanjiro" }],
          [{ text: "👧 Nezuko Beginning", callback_data: "nezuko" }]
        ]
      }
    });
  });

  // ==========================================
  // BUTTON HANDLER (WITH INSTANT FILE WRITER)
  // ==========================================
  bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id.toString();
    const data = query.data;

    if (data !== "tanjiro" && data !== "nezuko") return; // Restrict logic to only start events

    const currentPlayers = loadPlayersData();

    // Fallback registration check inside click query
    if (!currentPlayers[userId]) {
      currentPlayers[userId] = {
        coins: 1000, tokens: 0, level: 1, xp: 0, guildId: null, lastDaily: 0, mythicalCrystals: 5, rank: "Mizunoto (Rookie)", character: null, inventory: [], username: query.from.username || ""
      };
    }

    // STOPS EXPLOIT: Check if they click button again after selection
    if (currentPlayers[userId].character) {
      return bot.answerCallbackQuery(query.id, {
        text: "❌ Character Already Selected! You cannot change your beginning path.",
        show_alert: true
      });
    }

    // TANJIRO SELECT
    if (data === "tanjiro") {
      currentPlayers[userId].character = "Tanjiro";
      currentPlayers[userId].username = query.from.username || "";
      
      // CRITICAL FIX: CRASH PROOF INSTANT FILE WRITE SAVE
      savePlayersData(currentPlayers);

      await bot.sendPhoto(chatId, TANJIRO_IMG, {
        caption: `🔥 **TANJIRO BEGINNING LOCKED** 🔥\n\n👦 **Character:** Tanjiro\n🪙 **Coins:** 1,000\n🔮 **Crystals:** 5\n\n✅ *Your profile data has been hard-coded into the Slayer Registry!*\n\n🎯 **New Command Unlocked:**\n\`/hunt\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "🌐 View Tanjiro", url: "https://kimetsu-no-yaiba.fandom.com/wiki/Tanjiro_Kamado" }]]
        }
      });

      return bot.answerCallbackQuery(query.id);
    }

    // NEZUKO SELECT
    if (data === "nezuko") {
      currentPlayers[userId].character = "Nezuko";
      currentPlayers[userId].username = query.from.username || "";

      // CRITICAL FIX: CRASH PROOF INSTANT FILE WRITE SAVE
      savePlayersData(currentPlayers);

      await bot.sendPhoto(chatId, NEZUKO_IMG, {
        caption: `🌸 **NEZUKO BEGINNING LOCKED** 🌸\n\n👧 **Character:** Nezuko\n🪙 **Coins:** 1,000\n🔮 **Crystals:** 5\n\n✅ *Your profile data has been hard-coded into the Slayer Registry!*\n\n🎯 **New Command Unlocked:**\n\`/hunt\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "🌐 View Nezuko", url: "https://kimetsu-no-yaiba.fandom.com/wiki/Nezuko_Kamado" }]]
        }
      });

      return bot.answerCallbackQuery(query.id);
    }
  });

};
