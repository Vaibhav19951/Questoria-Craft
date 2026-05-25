/**
 * VELIX OS V2.5 | CENTRAL STORAGE & INVENTORY MATRIX
 * Fully Synchronized with Centralized Ledger & Forge Materials Ledger
 * Multi-Thread Safe Array Mapper for Slayers & Essences
 */

console.log("晶 [LOADED SUCCESS] Inventory Grid Database Core Linked: inventory.js");

module.exports = (bot) => {
  bot.onText(/\/inventory/, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    // Pulling unified user data from centralized system engine hook
    const player = bot.getPlayerData ? bot.getPlayerData(userId) : null;
    if (!player) return;

    // Safety checks for inventory and material objects structure fallback
    if (!player.inventory || !Array.isArray(player.inventory)) player.inventory = [];
    if (!player.materials) player.materials = {};

    try {
      // 1. Compile Slayers/Squad Grid Section
      let slayerListText = "";
      if (player.inventory.length === 0) {
        slayerListText = "   *No active squad members found inside your grid. Deploy tokens via /summon.*\n";
      } else {
        player.inventory.forEach((item, index) => {
          let name = "";
          let level = 1;

          if (typeof item === "string") {
            name = item;
            level = 1;
          } else {
            name = item.name || "Unknown Slayer";
            level = parseInt(item.level, 10) || 1;
          }

          // Dynamic Rank Emotes based on level thresholds
          let rankStars = "⭐".repeat(level);
          slayerListText += `   \`[${index + 1}]\` **${name}**\n   └ 📊 Rank: Level \`${level}/5\` ${rankStars}\n\n`;
        });
      }

      // 2. Compile Materials/Essence Storage Section
      let materialsText = "";
      const materialKeys = Object.keys(player.materials).filter(key => player.materials[key] > 0);

      if (materialKeys.length === 0) {
        materialsText = "   *Your material sub-ledger channels are currently vacant.*\n";
      } else {
        materialKeys.forEach(key => {
          const count = player.materials[key] || 0;
          let cleanName = key.replace(/_/g, " ").toUpperCase();
          materialsText += `   🧪 **${cleanName}:** \`${count}\` Units\n`;
        });
      }

      // 3. Assemble Premium Cybernetic Dashboard View
      const dashboardText = 
        `🎒 **VELIX OS | CENTRAL STORAGE INVENTORY**\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 **Slayer Identifier:** \`${msg.from.first_name}\`\n\n` +
        `⚔️ **ACTIVE FACTION SQUAD GRID:**\n` +
        `───────────────────────────\n` +
        slayerListText +
        `🧪 **FORGE CATALYSTS & MATERIALS:**\n` +
        `───────────────────────────\n` +
        materialsText +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `💡 *To transcend your warriors to peak ranks, execute: \`/upgrade <name>\`*`;

      // Dispatch Transmission
      await bot.sendMessage(chatId, dashboardText, { parse_mode: "Markdown" });

    } catch (err) {
      console.error("❌ Critical inventory rendering glitch:", err.message);
      bot.sendMessage(chatId, "❌ **System Error:** Failed to decode local storage matrix grid. Contact operator.");
    }
  });
};
