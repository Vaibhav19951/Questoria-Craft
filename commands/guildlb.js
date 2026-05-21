const guilds = require("../data/guild");

module.exports = (bot) => {

  bot.onText(/\/guildlb/, (msg) => {

    const chatId = msg.chat.id;

    const guildArray = Object.values(guilds)
      .filter(g => g && g.name)
      .sort(
        (a, b) =>
          (b.vault?.coins || 0) -
          (a.vault?.coins || 0)
      );

    if (guildArray.length === 0) {
      return bot.sendMessage(
        chatId,
        "❌ No guilds found."
      );
    }

    let text = "🏆 GUILD LEADERBOARD 🏆\n\n";

    guildArray.slice(0, 10).forEach((guild, index) => {

      text +=
`${index + 1}. ${guild.name}
👥 ${guild.members.length}/${guild.maxMembers}
🏦 ${guild.vault.coins} Coins

`;

    });

    bot.sendAnimation(
      chatId,
      "https://i.pinimg.com/originals/b1/76/95/b176956f18223739da05d785927e02ca.gif",
      {
        caption: text
      }
    );

  });

};
