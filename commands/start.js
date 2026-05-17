// Remove the requires and bot initialization from here, 
// because index.js already handles that!

module.exports = (bot) => { 
  bot.onText(/\/start/, async (msg) => { 
    const chatId = msg.chat.id; 
   
    try { 
      await bot.sendPhoto( 
        chatId, 
        "https://kommodo.ai/i/ip5xqtnqGqXGpuQxOpkZ", 
        { 
          // Added quotation marks around the string!
          caption: "⚔️ WELCOME TO DEMON SLAYER BOT ⚔️", 
        } 
      ); 
    } catch (err) { 
      console.log(err); 
      bot.sendMessage(chatId, "Error aa gaya start image me 😓"); 
    } 
  }); 
};
