const players = require("../data/players");
const guilds = require("../data/guild");

const OWNER_ID = "2086993762";

// =========================
// SAFE HELPERS
// =========================
const isOwner = (msg) => msg.from.id.toString() === OWNER_ID;

const getPlayer = (id) => {
  if (!players[id]) {
    players[id] = {
      coins: 0,
      mythicalCrystals: 0,
      inventory: [],
      level: 1,
      xp: 0
    };
  }
  return players[id];
};

module.exports = (bot) => {

  // =========================
  // OWNER PANEL
  // =========================
  bot.onText(/\/owner/, (msg) => {

    if (!isOwner(msg)) {
      return bot.sendMessage(msg.chat.id, "❌ Access denied.");
    }

    bot.sendAnimation(
      msg.chat.id,
      "https://i.pinimg.com/originals/e2/f7/45/e2f745698b639d14dbd4c1567e5f03d6.gif",
      {
        caption:
`👑 OWNER PANEL 👑

💰 Economy
/addcoins ID amount
/removecoins ID amount
/addtokens ID amount
/removetokens ID amount

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
    bot.sendMessage(msg.chat.id, `🆔 Your ID: ${msg.from.id}`);
  });

  // =========================
  // ADD COINS
  // =========================
  bot.onText(/\/addcoins (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const target = match[1];
    const amount = parseInt(match[2]);

    const p = getPlayer(target);
    p.coins += amount;

    players.save();

    bot.sendMessage(msg.chat.id, `✅ Added ${amount} coins to ${target}`);
  });

  const players = require("../data/players");

const OWNER_ID = "2086993762";

const isOwner = (msg) => msg.from.id.toString() === OWNER_ID;

const getOwnerInventory = () => {
  const owner = players[OWNER_ID];

  if (!owner) {
    players[OWNER_ID] = { inventory: [] };
  }

  if (!players[OWNER_ID].inventory) {
    players[OWNER_ID].inventory = [];
  }

  return players[OWNER_ID].inventory;
};

module.exports = (bot) => {

  // =========================
  // ADD CHARACTER TO PLAYER
  // =========================
  bot.onText(/\/addcharacter (\d+) (.+) (normal|mythical)/i, (msg, match) => {
    if (!isOwner(msg)) return;

    const userId = match[1];
    const character = match[2].trim();
    const type = match[3].toLowerCase();

    if (!players[userId]) {
      players[userId] = {
        coins: 0,
        mythicalCrystals: 0,
        inventory: []
      };
    }

    if (!players[userId].inventory) {
      players[userId].inventory = [];
    }

    players[userId].inventory.push(`${character}|${type}`);

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Added ${character} (${type}) to ${userId}`
    );
  });

  // =========================
  // REMOVE CHARACTER FROM PLAYER
  // =========================
  bot.onText(/\/removecharacter (\d+) (.+)/i, (msg, match) => {
    if (!isOwner(msg)) return;

    const userId = match[1];
    const character = match[2].trim();

    if (!players[userId] || !players[userId].inventory) {
      return bot.sendMessage(msg.chat.id, "❌ Player not found");
    }

    players[userId].inventory =
      players[userId].inventory.filter(c => !c.startsWith(character + "|"));

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `🗑️ Removed ${character} from ${userId}`
    );
  });
  // =========================
  // REMOVE COINS
  // =========================
  bot.onText(/\/removecoins (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const target = match[1];
    const amount = parseInt(match[2]);

    const p = getPlayer(target);
    p.coins = Math.max(0, p.coins - amount);

    players.save();

    bot.sendMessage(msg.chat.id, `✅ Removed ${amount} coins`);
  });

  // =========================
  // ADD TOKENS
  // =========================
  bot.onText(/\/addtokens (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const target = match[1];
    const amount = parseInt(match[2]);

    const p = getPlayer(target);
    p.mythicalCrystals += amount;

    players.save();

    bot.sendMessage(msg.chat.id, `✅ Added ${amount} tokens`);
  });

  // =========================
  // REMOVE TOKENS
  // =========================
  bot.onText(/\/removetokens (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const target = match[1];
    const amount = parseInt(match[2]);

    const p = getPlayer(target);
    p.mythicalCrystals = Math.max(0, p.mythicalCrystals - amount);

    players.save();

    bot.sendMessage(msg.chat.id, `✅ Removed ${amount} tokens`);
  });

  // =========================
  // ADD CHARACTER (FIXED - NO INVENTORY MESS)
  // =========================
  bot.onText(/\/addcharacter (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const input = match[1].split("|");

    if (input.length < 3) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Format:\n/addcharacter Name|imageURL|type"
      );
    }

    const name = input[0].trim();
    const image = input[1].trim();
    const type = input[2].trim();

    // store in players global inventory system (safe fallback)
    const p = getPlayer(OWNER_ID);
    p.inventory.push(`${name}|${image}|${type}`);

    players.save();

    bot.sendMessage(msg.chat.id, `✅ Character stored: ${name}`);
  });

  // =========================
  // REMOVE CHARACTER
  // =========================
  bot.onText(/\/removecharacter (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const name = match[1].trim();

    const p = getPlayer(OWNER_ID);

    p.inventory = p.inventory.filter(c => !c.startsWith(name + "|"));

    players.save();

    bot.sendMessage(msg.chat.id, `🗑️ Removed: ${name}`);
  });

  // =========================
  // CHECK PLAYER
  // =========================
  bot.onText(/\/checkplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const target = match[1];
    const player = players[target];

    if (!player) {
      return bot.sendMessage(msg.chat.id, "❌ Player not found.");
    }

    bot.sendMessage(msg.chat.id,
`👤 PLAYER INFO

🆔 ${target}
💰 Coins: ${player.coins}
🧬 Tokens: ${player.mythicalCrystals}
⭐ Level: ${player.level}`);
  });

  // =========================
  // RESET PLAYER
  // =========================
  bot.onText(/\/resetplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const target = match[1];

    delete players[target];
    players.save();

    bot.sendMessage(msg.chat.id, `✅ Reset player ${target}`);
  });

  // =========================
  // DELETE GUILD
  // =========================
  bot.onText(/\/deleteguild (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const name = match[1];

    if (!guilds[name]) {
      return bot.sendMessage(msg.chat.id, "❌ Guild not found");
    }

    delete guilds[name];
    guilds.save();

    bot.sendMessage(msg.chat.id, `✅ Deleted guild ${name}`);
  });

};
