module.exports = (bot) => {

  // =========================
  // HELP COMMAND
  // =========================
  bot.onText(/\/help/, (msg) => {

    const chatId = msg.chat.id;

    const image = "https://i.pinimg.com/1200x/5e/3d/77/5e3d77131f4866906087659fddc0ff3c.jpg"; 
    // 👆 apna valid image URL yaha dal

    const caption = `
📘 *RPG HELP CENTER*

⚡ Select category below 👇
    `;

    bot.sendPhoto(chatId, image, {
      caption: caption,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "🏰 Guild System", callback_data: "help_guild" },
            { text: "💰 Economy System", callback_data: "help_economy" }
          ],
          [
            { text: "👤 Profile System", callback_data: "help_profile" },
            { text: "⚔️ Battle System", callback_data: "help_battle" }
          ],
          [
            { text: "📘 Guide", callback_data: "help_guide" },
            { text: "🏆 Leaderboard", callback_data: "help_lb" }
          ],
          [
            { text: "🌐 Full Docs", url: "https://example.com/rpg-bot-docs" }
          ]
        ]
      }
    });
  });

  // =========================
  // BUTTON HANDLER
  // =========================
  bot.on("callback_query", (q) => {

    const chatId = q.message.chat.id;
    const data = q.data;

    let text = "";

    if (data === "help_guild") {
      text = `
🏰 GUILD SYSTEM

/createguild <name>
/joinguild <name>
/myguild
/guildlb
/upgradeguild
      `;
    }

    if (data === "help_economy") {
      text = `
💰 ECONOMY SYSTEM

/balance
/daily
/work
/deposit coins 100
/deposit tokens 5
      `;
    }

    if (data === "help_profile") {
      text = `
👤 PROFILE SYSTEM

/profile → stats
/inventory → items
/char → characters
/equip → equip items
      `;
    }

    if (data === "help_battle") {
      text = `
⚔️ BATTLE SYSTEM

/battle → fight
/summon → summon characters
      `;
    }

    if (data === "help_guide") {
      text = `
📘 GUIDE

/guide → full visual guide with images + buttons
      `;
    }

    if (data === "help_lb") {
      text = `
🏆 LEADERBOARD

/guildlb → guild ranking system
      `;
    }

    bot.sendMessage(chatId, text);
    bot.answerCallbackQuery(q.id);
  });

};
