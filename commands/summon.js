module.exports = (bot) => {
  const characters = [
    {
      name: "🔥 Tanjiro Kamado",
      image: "./assets/tanjiro.jpg",
    },
    {
      name: "⚡ Zenitsu Agatsuma",
      image: "./assets/zenitsu.jpg",
    },
    {
      name: "🐗 Inosuke Hashibira",
      image: "./assets/inosuke.jpg",
    },
  ];

  bot.onText(/\/summon/, async (msg) => {
    const chatId = msg.chat.id;

    const random =
      characters[Math.floor(Math.random() * characters.length)];

    try {
      await bot.sendPhoto(chatId, random.image, {
        caption: `🎴 SUMMON SUCCESS!

👤 You got: ${random.name}`,
      });
    } catch (err) {
      console.log(err);
      bot.sendMessage(chatId, "Summon failed 😓");
    }
  });
};
