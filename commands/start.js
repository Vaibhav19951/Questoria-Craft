const players = require("../data/players");

module.exports = (bot) => {

  // =========================
  // IMAGES
  // =========================
const START_IMG =
  "https://i.pinimg.com/736x/e1/97/3e/e1973e8421e69bc09f731b60f5102d97.jpg";

const TANJIRO_IMG =
  "https://i.pinimg.com/736x/ab/26/81/ab26817caf5dbd8bd82f698f517649b7.jpg";

const NEZUKO_IMG =
  "https://i.pinimg.com/736x/6c/02/c9/6c02c93d3991470183f6c169d1adc64e.jpg";

  // =========================
  // START
  // =========================
  bot.onText(/\/start/, async (msg) => {

    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    if (!players[userId]) {
      players[userId] = {
        coins: 1000,
        gems: 0,
        mythicalCrystals: 5,
        cards: [],
        character: null
      };
    }

    await bot.sendPhoto(chatId, START_IMG, {
      caption: `
⚔️ WELCOME TO DEMON SLAYER BOT ⚔️

Choose Your Beginning 👇
`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "👦 Tanjiro Beginning",
              callback_data: "tanjiro"
            }
          ],
          [
            {
              text: "👧 Nezuko Beginning",
              callback_data: "nezuko"
            }
          ]
        ]
      }
    });

  });

  // =========================
  // BUTTONS
  // =========================
  bot.on("callback_query", async (query) => {

    const chatId = query.message.chat.id;
    const userId = query.from.id.toString();
    const data = query.data;

    // TANJIRO
    if (data === "tanjiro") {

      players[userId].character = "Tanjiro";

      await bot.sendPhoto(chatId, TANJIRO_IMG, {
        caption: `
🔥 TANJIRO BEGINNING 🔥

👦 Character: Tanjiro
🪙 Coins: 1000
💎 Gems: 0
🔮 Crystals: 5
`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🌐 View Tanjiro",
                url: "https://kimetsu-no-yaiba.fandom.com/wiki/Tanjiro_Kamado"
              }
            ]
          ]
        }
      });

      return bot.answerCallbackQuery(query.id);
    }

    // NEZUKO
    if (data === "nezuko") {

      players[userId].character = "Nezuko";

      await bot.sendPhoto(chatId, NEZUKO_IMG, {
        caption: `
🌸 NEZUKO BEGINNING 🌸

👧 Character: Nezuko
🪙 Coins: 1000
💎 Gems: 0
🔮 Crystals: 5
`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🌐 View Nezuko",
                url: "https://kimetsu-no-yaiba.fandom.com/wiki/Nezuko_Kamado"
              }
            ]
          ]
        }
      });

      return bot.answerCallbackQuery(query.id);
    }

  });

};
