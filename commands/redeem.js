/**
 * VELIX OS V2.5 | MYTHICAL CARD EXCHANGE & REDEEM TERMINAL
 * Fully Synchronized with Centralized Ledger & Inventory Grid
 * Cross-Module Data Protection Layer (Anti-Duplication State Engine)
 */

const mythical = require("../asset/mythical");

console.log("🎟️ [LOADED SUCCESS] Mythical Exchange Redeem Matrix Active: redeem.js");

module.exports = (bot) => {
  bot.onText(/^\/redeem (.+)$/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString();

    // Pulling the core unified player state from ledger hook
    const player = bot.getPlayerData ? bot.getPlayerData(userId) : null;
    if (!player) return;

    // Strict state fallback assertions
    if (player.mythicalCrystals === undefined) player.mythicalCrystals = player.crystals || 0;
    if (!player.inventory || !Array.isArray(player.inventory)) player.inventory = [];

    const cardId = match[1].trim().toLowerCase();

    // Map character blueprint inside asset manifest array
    const card = mythical.find(
      (c) => c.id && c.id.toLowerCase() === cardId
    );

    if (!card) {
      return bot.sendMessage(
        chatId,
        "❌ **Registry Error:** Specified Card ID does not exist in active databases.\n💡 *Run \`/mythicalshop\` to verify item identifiers.*"
      );
    }

    // Advanced Ownership Trace Scan within primary inventory array standard
    const alreadyOwned = player.inventory.some((item) => {
      if (!item) return false;
      const itemName = typeof item === "string" ? item : (item.name || "");
      return itemName.toLowerCase().includes(card.name.toLowerCase());
    });

    if (alreadyOwned) {
      return bot.sendMessage(
        chatId,
        `⚠️ **Asset Redundancy:** You have already integrated **${card.name}** into your central squad division mapping.`
      );
    }

    // Ledger balance restriction check
    if (player.mythicalCrystals < card.cost) {
      return bot.sendMessage(
        chatId,
        `❌ **Ledger Insufficient:** Redemption sequence denied.\n\n` +
        `💳 **Required Investment:** 💎 \`${card.cost}\` Crystals\n` +
        `💎 **Your Balance Assets:** 💎 \`${player.mythicalCrystals}\` Crystals`
      );
    }

    // Atomic Deduction and Character Mapping injection sequence
    player.mythicalCrystals -= card.cost;
    if (player.crystals !== undefined) player.crystals = player.mythicalCrystals; // Dual alignment sync

    player.inventory.push({
      id: card.id,
      name: card.name,
      type: "mythic_slayer",
      level: 1,
      power: parseInt(card.power, 10) || 500,
      acquiredAt: new Date().toISOString()
    });

    // Save and close transaction vault via core engine loop
    if (bot.savePlayerData) {
      bot.savePlayerData(userId, player);
    }

    const verificationCaption = 
        `🎉 **VELIX OS | MYTHICAL ALLIANCE REDEEMED** 🎉\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `The asset conversion pipeline successfully established a soul matrix lock.\n\n` +
        `🎴 **Acquired Faction Soul:** \`${card.name}\`\n` +
        `⚔️ **Inherent Power Base:** \`${(card.power || 0).toLocaleString()} CP\`\n` +
        `💠 **Remaining Vault Balance:** 💎 \`${player.mythicalCrystals}\` Crystals\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `✅ *Character records initialized at Level 1 and synced to your primary inventory profiles.*`;

    if (card.image) {
      bot.sendPhoto(chatId, card.image, {
        caption: verificationCaption,
        parse_mode: "Markdown"
      }).catch((err) => {
        console.error("Error broadcasting photo card redemption layout:", err.message);
        bot.sendMessage(chatId, verificationCaption, { parse_mode: "Markdown" });
      });
    } else {
      bot.sendMessage(chatId, verificationCaption, { parse_mode: "Markdown" });
    }
  });
};
