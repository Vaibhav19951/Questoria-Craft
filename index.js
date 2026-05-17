const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true,
});

// Commands load
require("./commands/start")(bot);
require("./commands/battle")(bot);
require("./commands/help")(bot);
require("./commands/inventory")(bot);
require("./commands/profile")(bot);
require("./commands/summon")(bot);

console.log("⚔️ Bot running...");
