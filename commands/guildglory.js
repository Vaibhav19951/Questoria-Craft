const guilds = require("../data/guild");

module.exports = (bot) => {

  // =========================
  // GUILD REWARDS PANEL
  // =========================
  bot.onText(/\/guildrewards/, (msg) => {

    const chatId = msg.chat.id;

    bot.sendPhoto(
      chatId,
      "https://pic-link-bot.lovable.app/i/telegram-1779356514904-618f311d.jpg",
      {
        caption:
`🏆 GUILD GLORY SYSTEM

⚔️ HOW IT WORKS

• Glory is earned automatically
through battles & activities.

• Every member has their own
personal contribution.

• Weekly rewards are distributed
based on YOUR contribution only.

📅 WEEKLY RESET:
Every Monday

━━━━━━━━━━━━━━━

🎁 REWARDS

🏆 2000 Glory
💰 50000 Coins

🏆 4000 Glory
💰 100000 Coins

🏆 6000 Glory
🧬 100 Mythical Tokens

🏆 8000 Glory
🏅 20 Guild Tokens

━━━━━━━━━━━━━━━

🔥 IMPORTANT

• No contribution = No rewards
• More Glory = Better rewards
• Top contributors earn more

⚔️ DEMON SLAYER BOT ⚔️`
      }
    );

  });

};
