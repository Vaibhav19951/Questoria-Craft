const players = require("../data/players");
const guilds = require("../data/guild");

const OWNER_ID = "2086993762";

module.exports = (bot) => {

  // =========================
  // OWNER CHECK
  // =========================
  const isOwner = (msg) => {
    return msg.from.id.toString() === OWNER_ID;
  };

  // =========================
  // OWNER PANEL
  // =========================
  bot.onText(/\/owner/, (msg) => {

    if (!isOwner(msg)) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Access denied."
      );
    }

    bot.sendAnimation(
      msg.chat.id,
      "https://i.pinimg.com/originals/e2/f7/45/e2f745698b639d14dbd4c1567e5f03d6.gif",
      {
        caption:
`👑 OWNER PANEL ACTIVATED 👑

✅ Owner confirmed

⚡ AVAILABLE COMMANDS ⚡

💰 Economy
/addcoins ID amount
/removecoins ID amount
/addtokens ID amount
/removetokens ID amount

🧬 Characters
/addcharacter ID character
/removecharacter ID character

👤 Player
/checkplayer ID
/resetplayer ID

🏰 Guild
/deleteguild guildname

🆔 Utility
/myid`,
        parse_mode: "Markdown"
      }
    );

  });

  // =========================
  // MY ID
  // =========================
  bot.onText(/\/myid/, (msg) => {

    bot.sendMessage(
      msg.chat.id,
      `🆔 Your ID: ${msg.from.id}`
    );

  });

  // =========================
  // ADD COINS
  // =========================
  bot.onText(/\/addcoins (\d+) (\d+)/, (msg, match) => {

    if (!isOwner(msg)) return;

    const target = match[1];
    const amount = parseInt(match[2]);

    if (!players[target]) {

      players[target] = {
        coins: 0,
        mythicalCrystals: 0,
        inventory: [],
        level: 1,
        xp: 0
      };

    }

    players[target].coins += amount;

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Added ${amount} coins to ${target}`
    );

  });

  // =========================
  // REMOVE COINS
  // =========================
  bot.onText(/\/removecoins (\d+) (\d+)/, (msg, match) => {

    if (!isOwner(msg)) return;

    const target = match[1];
    const amount = parseInt(match[2]);

    if (!players[target]) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Player not found."
      );
    }

    players[target].coins -= amount;

    if (players[target].coins < 0) {
      players[target].coins = 0;
    }

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Removed ${amount} coins`
    );

  });

  // =========================
  // ADD TOKENS
  // =========================
  bot.onText(/\/addtokens (\d+) (\d+)/, (msg, match) => {

    if (!isOwner(msg)) return;

    const target = match[1];
    const amount = parseInt(match[2]);

    if (!players[target]) {

      players[target] = {
        coins: 0,
        mythicalCrystals: 0,
        inventory: [],
        level: 1,
        xp: 0
      };

    }

    players[target].mythicalCrystals += amount;

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Added ${amount} tokens`
    );

  });

  // =========================
  // REMOVE TOKENS
  // =========================
  bot.onText(/\/removetokens (\d+) (\d+)/, (msg, match) => {

    if (!isOwner(msg)) return;

    const target = match[1];
    const amount = parseInt(match[2]);

    if (!players[target]) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Player not found."
      );
    }

    players[target].mythicalCrystals -= amount;

    if (players[target].mythicalCrystals < 0) {
      players[target].mythicalCrystals = 0;
    }

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Removed ${amount} tokens`
    );

  });

  // =========================
  // ADD CHARACTER
  // =========================
  bot.onText(/\/addcharacter (\d+) (.+)/, (msg, match) => {

    if (!isOwner(msg)) return;

    const target = match[1];
    const character = match[2];

    if (!players[target]) {

      players[target] = {
        coins: 0,
        mythicalCrystals: 0,
        inventory: [],
        level: 1,
        xp: 0
      };

    }

    if (!players[target].inventory) {
      players[target].inventory = [];
    }

    players[target].inventory.push(character);

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Added ${character} to ${target}`
    );

  });

  // =========================
  // REMOVE CHARACTER
  // =========================
  bot.onText(/\/removecharacter (\d+) (.+)/, (msg, match) => {

    if (!isOwner(msg)) return;

    const target = match[1];
    const character = match[2];

    if (
      !players[target] ||
      !players[target].inventory
    ) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Inventory not found."
      );
    }

    players[target].inventory =
      players[target].inventory.filter(
        c => c !== character
      );

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Removed ${character}`
    );

  });

  // =========================
  // CHECK PLAYER
  // =========================
  bot.onText(/\/checkplayer (\d+)/, (msg, match) => {

    if (!isOwner(msg)) return;

    const target = match[1];

    const player = players[target];

    if (!player) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Player not found."
      );
    }

    bot.sendMessage(
      msg.chat.id,
`👤 PLAYER INFO

🆔 ${target}

💰 Coins:
${player.coins}

🧬 Tokens:
${player.mythicalCrystals}

⭐ Level:
${player.level}`
    );

  });

  // =========================
  // RESET PLAYER
  // =========================
  bot.onText(/\/resetplayer (\d+)/, (msg, match) => {

    if (!isOwner(msg)) return;

    const target = match[1];

    delete players[target];

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Reset player ${target}`
    );

  });

  // =========================
  // DELETE GUILD
  // =========================
  bot.onText(/\/deleteguild (.+)/, (msg, match) => {

    if (!isOwner(msg)) return;

    const guildName = match[1];

    if (!guilds[guildName]) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Guild not found."
      );
    }

    delete guilds[guildName];

    guilds.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Deleted guild ${guildName}`
    );

  });

};
