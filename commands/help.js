module.exports = (bot) => { 
  bot.onText(/\/help/, async (msg) => { 
    const chatId = msg.chat.id; 
    
    // Using backticks () allows you to write multi-line text!
    const helpMessage = 📜 Commands: 
/start - Start game 
/help - Show commands 
/summon - Summon a character 
/inventory - View inventory 
/battle - Fight a demon 
/profile - View profile`;

    try {
      await bot.sendMessage(chatId, helpMessage);
    } catch (err) {
      console.log(err);
      bot.sendMessage(chatId, "Error showing help commands 😓");
    }
  }); 
};
