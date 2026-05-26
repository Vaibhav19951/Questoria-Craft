/**
 * VELIX OS V2.5 | LIVE PING & MONITORING
 * "Pong!" with real-time Latency, Runtime, and Tagging
 */

module.exports = (bot) => {
  bot.onText(/\/ping/, async (msg) => {
    const chatId = msg.chat.id;
    const start = Date.now();

    // 1. Instant Pong Response
    const sentMsg = await bot.sendMessage(chatId, "🏓 **Pong!**\nMeasuring system metrics...");

    // 2. Metrics Calculation
    const latency = Date.now() - start;
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // 3. Tagging All Users (Example logic)
    // Note: Replace this with your specific database user list
    const tagAll = "@everyone"; 

    // 4. Update message with Live Data
    bot.editMessageText(
      `🏓 **Pong!**\n\n` +
      `📡 **Latency:** \`${latency}ms\`\n` +
      `⏳ **Runtime:** \`${hours}h ${minutes}m ${seconds}s\`\n` +
      `📢 **Broadcast:** ${tagAll}\n` +
      `━━━━━━━━━━━━━━━━━━━\n` +
      `*VELIX OS is running optimally.*`,
      {
        chat_id: chatId,
        message_id: sentMsg.message_id,
        parse_mode: 'Markdown'
      }
    );
  });
};
