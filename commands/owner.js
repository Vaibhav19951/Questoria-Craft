const players = require("../data/players");
const guilds = require("../data/guild");

const OWNER_ID = "2086993762";

// =========================
// OWNER CHECK
// =========================
const isOwner = (msg) => msg.from.id.toString() === OWNER_ID;

// =========================
// PLAYER INIT
// =========================
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
    if (!isOwner(msg)) return;

    bot.sendAnimation(
      msg.chat.id,
      "https://i.pinimg.com/originals/e2/f7/45/e2f745698b639d14dbd4c1567e5f03d6.gif",
      {
        caption:
`👑 OWNER PANEL

💰 /addcoins ID AMOUNT
💰 /removecoins ID AMOUNT
💎 /addtokens ID AMOUNT
💎 /removetokens ID AMOUNT

🧬 /addcharacter USERID Name|Image|Type
🗑️ /removecharacter USERID CharacterID

👤 /checkplayer ID
🔄 /resetplayer ID

🏰 /deleteguild NAME`
      }
    );
  });

  // =========================
  // MY ID
  // =========================
  bot.onText(/\/myid/, (msg) => {
    bot.sendMessage(msg.chat.id, `🆔 ${msg.from.id}`);
  });

  // =========================
  // ADD COINS
  // =========================
  bot.onText(/\/addcoins (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const p = getPlayer(match[1]);
    p.coins += parseInt(match[2]);

    players.save();
    bot.sendMessage(msg.chat.id, "✅ Coins added");
  });

  // =========================
  // REMOVE COINS
  // =========================
  bot.onText(/\/removecoins (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const p = getPlayer(match[1]);
    p.coins = Math.max(0, p.coins - parseInt(match[2]));

    players.save();
    bot.sendMessage(msg.chat.id, "🗑️ Coins removed");
  });

  // =========================
  // ADD TOKENS
  // =========================
  bot.onText(/\/addtokens (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const p = getPlayer(match[1]);
    p.mythicalCrystals += parseInt(match[2]);

    players.save();
    bot.sendMessage(msg.chat.id, "💎 Tokens added");
  });

  // =========================
  // REMOVE TOKENS
  // =========================
  bot.onText(/\/removetokens (\d+) (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const p = getPlayer(match[1]);
    p.mythicalCrystals = Math.max(0, p.mythicalCrystals - parseInt(match[2]));

    players.save();
    bot.sendMessage(msg.chat.id, "🗑️ Tokens removed");
  });

  // =========================
  // ADD CHARACTER
  // FORMAT:
  // /addcharacter USERID Name|Image|Type
  // =========================
  bot.onText(/\/addcharacter (\d+) (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const userId = match[1];
    const input = match[2].split("|");

    if (input.length < 3) {
      return bot.sendMessage(
        msg.chat.id,
        "❌ Format:\n/addcharacter USERID Name|Image|Type"
      );
    }

    const name = input[0].trim();
    const image = input[1].trim();
    const type = input[2].trim();

    const p = getPlayer(userId);

    const charId = "c" + Date.now();

    p.inventory.push(`${charId}|${name}|${image}|${type}`);

    players.save();

    bot.sendMessage(
      msg.chat.id,
      `✅ Added ${name}\n🆔 ${charId}`
    );
  });

  // =========================
  // REMOVE CHARACTER
  // =========================
  bot.onText(/\/removecharacter (\d+) (.+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const userId = match[1];
    const charId = match[2];

    const p = getPlayer(userId);

    p.inventory = p.inventory.filter(c => {
      const [id] = c.split("|");
      return id !== charId;
    });

    players.save();

    bot.sendMessage(msg.chat.id, "🗑️ Character removed");
  });

  // =========================
  // CHECK PLAYER
  // =========================
  bot.onText(/\/checkplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    const p = getPlayer(match[1]);

    bot.sendMessage(msg.chat.id,
`👤 PLAYER INFO

💰 Coins: ${p.coins}
💎 Tokens: ${p.mythicalCrystals}
⭐ Level: ${p.level}
⚡ XP: ${p.xp}`);
  });

  // =========================
  // RESET PLAYER
  // =========================
  bot.onText(/\/resetplayer (\d+)/, (msg, match) => {
    if (!isOwner(msg)) return;

    delete players[match[1]];
    players.save();

    bot.sendMessage(msg.chat.id, "🔄 Player reset done");
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

    bot.sendMessage(msg.chat.id, `🗑️ Guild deleted: ${name}`);
  });

};
