/**
 * VELIX OS V2.5 | ARSENAL REGISTRY & WEAPONS MANIFEST
 * Fully Optimized for Core UI Scannability & Technical Layouts
 * Safe Execution Guardrail Against Empty Asset Formats
 */

const weapons = require("../asset/weapons.js");

console.log("🗡️ [LOADED SUCCESS] Weapon Inventory Manifest Loaded: weapons.js");

module.exports = (bot) => {
  bot.onText(/\/weapons/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      // Safety handling if weapon registry is corrupted or unreadable
      if (!weapons || !Array.isArray(weapons) || weapons.length === 0) {
        return bot.sendMessage(chatId, "⚠️ **Registry Error:** The central weapon storage array is currently offline or vacant.");
      }

      let manifestText = `🗡️ **VELIX OS | COMPLETE ARSENAL REGISTRY**\n` +
                         `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                         `Current anti-demon armaments verified inside the systemic databases:\n\n`;

      weapons.forEach((weapon) => {
        manifestText += `⚡ **[ID: ${weapon.id}] ${weapon.name}**\n` +
                        `   🔹 Offensive Rating: \`+${weapon.damage} DMG\`\n` +
                        `   └ 🪙 Standard Value: \`${(weapon.price || 0).toLocaleString()}\` Crow Coins\n\n`;
      });

      manifestText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
                      `💡 *To buy any armament from this framework, run:* \`/buy <weapon_id>\``;

      // Dispatch pristine stylized transmission
      await bot.sendMessage(chatId, manifestText, { parse_mode: "Markdown" });

    } catch (err) {
      console.error("❌ Critical asset manifestation error:", err.message);
      bot.sendMessage(chatId, "❌ **System Error:** Failed to index and parse local weapon manifest frameworks.");
    }
  });
};
