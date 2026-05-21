const guilds = require("../data/guild");
const players = require("../data/players");

module.exports = (bot) => {

  // =========================
  // GUILD REWARDS PANEL
  // =========================
  bot.onText(/\/guildrewards/, (msg) => {

    const chatId = msg.chat.id;

    bot.sendPhoto(
      chatId,
      "YOUR_GUILD_GLORY_IMAGE_URL",
      {
        caption:
`🏆 GUILD GLORY SYSTEM

⚔️ Earn Glory by:
• Winning Battles
• Guild Raids
• Events
• Daily Missions

👥 Every member has personal contribution.

🎁 Weekly rewards are distributed
based on YOUR own glory.

📅 Weekly Reset:
Monday

🔥 DEMON SLAYER BOT 🔥`
      }
    );

  });

  // =========================
  // ADD GLORY
  // =========================
  bot.onText(/\/addglory (\d+)/, (msg, match) => {

    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    const amount = parseInt(match[1]);

    // =========================
    // FIND USER GUILD
    // =========================
    let guild = null;

    for (const name in guilds) {

      if (
        guilds[name] &&
        guilds[name].members &&
        guilds[name].members.includes(userId)
      ) {

        guild = guilds[name];
        break;

      }

    }

    if (!guild) {
      return bot.sendMessage(
        chatId,
        "❌ You are not in a guild."
      );
    }

    // =========================
    // SAFE SYSTEM
    // =========================
    if (!guild.glory) {
      guild.glory = 0;
    }

    if (!guild.memberGlory) {
      guild.memberGlory = {};
    }

    if (!guild.memberGlory[userId]) {
      guild.memberGlory[userId] = 0;
    }

    // =========================
    // ADD GLORY
    // =========================
    guild.glory += amount;

    guild.memberGlory[userId] += amount;

    guilds.save();

    bot.sendPhoto(
      chatId,
      "YOUR_GUILD_GLORY_IMAGE_URL",
      {
        caption:
`✨ GLORY ADDED

🏰 Guild:
${guild.name}

👤 Player:
${msg.from.first_name}

⚔️ Added Glory:
${amount}

🏆 Your Total Glory:
${guild.memberGlory[userId]}

🔥 Guild Total Glory:
${guild.glory}

🎁 Weekly rewards depend on
your personal contribution.

⚔️ DEMON SLAYER BOT ⚔️`
      }
    );

  });

  // =========================
  // MY GLORY
  // =========================
  bot.onText(/\/myglory/, (msg) => {

    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    let guild = null;

    for (const name in guilds) {

      if (
        guilds[name] &&
        guilds[name].members &&
        guilds[name].members.includes(userId)
      ) {

        guild = guilds[name];
        break;

      }

    }

    if (!guild) {
      return bot.sendMessage(
        chatId,
        "❌ You are not in a guild."
      );
    }

    if (!guild.memberGlory) {
      guild.memberGlory = {};
    }

    const userGlory =
      guild.memberGlory[userId] || 0;

    bot.sendPhoto(
      chatId,
      "https://pic-link-bot.lovable.app/i/telegram-1779356514904-618f311d.jpg",
      {
        caption:
`🏆 YOUR GUILD GLORY

🏰 Guild:
${guild.name}

👤 Player:
${msg.from.first_name}

⚔️ Your Glory:
${userGlory}

🔥 Guild Total Glory:
${guild.glory}

📅 Rewards are distributed weekly.

🎁 More contribution
= Better rewards.

⚔️ DEMON SLAYER BOT ⚔️`
      }
    );

  });

};
