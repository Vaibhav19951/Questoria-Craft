const fs = require("fs");
const path = require("path");

const playerFile = path.join(__dirname, "../data/players.json");
const guildFile = path.join(__dirname, "../data/guild.json");

// LOAD
let players = {};
let guilds = {};

try { players = JSON.parse(fs.readFileSync(playerFile, "utf8")); } catch { players = {}; }
try { guilds = JSON.parse(fs.readFileSync(guildFile, "utf8")); } catch { guilds = {}; }

// SAVE
const savePlayers = () => fs.writeFileSync(playerFile, JSON.stringify(players, null, 2));
const saveGuilds = () => fs.writeFileSync(guildFile, JSON.stringify(guilds, null, 2));

// USER INIT
const getUser = (userId) => {
  if (!players[userId]) {
    players[userId] = {
      coins: 1000,
      tokens: 0, // Bank balance
      level: 1,
      xp: 0,
      guildId: null,
      lastDaily: 0 
    };
    savePlayers();
  }
  return players[userId];
};

// GUILD INIT
const getGuild = (guildId) => {
  if (!guilds[guildId]) {
    guilds[guildId] = {
      name: "Unknown Guild",
      bank: 0
    };
    saveGuilds();
  }
  return guilds[guildId];
};

module.exports = (bot) => {

  // =========================
  // 1. BALANCE COMMAND
  // =========================
  bot.onText(/\/balance/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const p = getUser(userId);

    const text = `⚔️ *Slayer Inventory* ⚔️\n\n👛 *Wallet:* ${p.coins} coins\n🏦 *Bank:* ${p.tokens} tokens`;
    bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  });

  // =========================
  // 2. DAILY REWARD COMMAND
  // =========================
  bot.onText(/\/daily/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const p = getUser(userId);

    const now = Date.now();
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours

    if (p.lastDaily && now - p.lastDaily < cooldown) {
      const timeLeft = cooldown - (now - p.lastDaily);
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minsLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return bot.sendMessage(chatId, `⏳ You already claimed your daily reward! Come back in *${hoursLeft}h ${minsLeft}m*.`, { parse_mode: "Markdown" });
    }

    const reward = 500;
    p.coins += reward;
    p.lastDaily = now;
    savePlayers();

    bot.sendMessage(chatId, `🎁 *Daily Reward!* You claimed *${reward} coins*!`, { parse_mode: "Markdown" });
  });

  // =========================
  // 3. WORK COMMAND
  // =========================
  bot.onText(/\/work/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const p = getUser(userId);

    const jobs = [
      "You trained hard with the Water Hashira",
      "You helped the Butterfly Mansion clean medical supplies",
      "You assisted Haganezuka in polishing swords",
      "You defeated a minor demon lurking in the woods"
    ];

    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
    const earnings = Math.floor(Math.random() * 150) + 50; 

    p.coins += earnings;
    savePlayers();

    bot.sendMessage(chatId, `💼 *Work:* ${randomJob} and earned *${earnings} coins*!`, { parse_mode: "Markdown" });
  });

  // =========================
  // 4. PLAYER DEPOSIT (BANK)
  // =========================
  bot.onText(/\/deposit(?: (.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const p = getUser(userId);

    let amountInput = match[1];

    if (!amountInput) {
      return bot.sendMessage(chatId, "ℹ️ Please specify an amount to deposit. Example: `/deposit 100` or `/deposit all`", { parse_mode: "Markdown" });
    }

    // Cleans up the text if they include the word "coins"
    amountInput = amountInput.toLowerCase().replace(/coins|coin/g, "").trim();

    let amount = 0;
    if (amountInput === "all") {
      amount = p.coins;
    } else {
      amount = Number(amountInput);
    }

    if (isNaN(amount) || amount <= 0) {
      return bot.sendMessage(chatId, "❌ Invalid amount! Please provide a valid number. Example: `/deposit 100`");
    }

    if (p.coins < amount) {
      return bot.sendMessage(chatId, "❌ Not enough coins in your wallet!");
    }

    p.coins -= amount;
    p.tokens += amount;
    savePlayers();

    bot.sendMessage(chatId, `🏦 Success! Deposited *${amount} coins* to your bank account.`, { parse_mode: "Markdown" });
  });

  // =========================
  // 5. GUILD DEPOSIT
  // =========================
  bot.onText(/\/guilddeposit(?: (.+))?/, (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();
    const p = getUser(userId);

    let amountInput = match[1];

    if (!amountInput) {
      return bot.sendMessage(chatId, "ℹ️ Please specify an amount to deposit to your guild. Example: `/guilddeposit 100`", { parse_mode: "Markdown" });
    }

    if (!p.guildId) {
      return bot.sendMessage(chatId, "❌ You are not in a guild");
    }

    const g = getGuild(p.guildId);
    
    // Cleans up the text if they include the word "coins" here too
    amountInput = amountInput.toLowerCase().replace(/coins|coin/g, "").trim();
    let amount = Number(amountInput);

    if (isNaN(amount) || amount <= 0) {
      return bot.sendMessage(chatId, "❌ Invalid amount");
    }

    if (p.coins < amount) {
      return bot.sendMessage(chatId, "❌ Not enough coins");
    }

    p.coins -= amount;
    g.bank += amount;

    savePlayers();
    saveGuilds();

    bot.sendMessage(
      chatId,
      `🏰 *Guild Deposit Successful!*\n💰 +${amount} coins added to guild bank\n🏦 Guild Bank: ${g.bank}`,
      { parse_mode: "Markdown" }
    );
  });

};
