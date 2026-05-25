/**
 * VELIX OS V2.5 | WEAPON COUPLING & ARSENAL LOADOUT ENGINE
 * Fully Integrated with Centralized Inventory Array & Profile Grids
 * Cross-Type Variable Safe (String/Int Combo Index Verification)
 */

console.log("⚔️ [LOADED SUCCESS] Tactical Loadout Coupling Engine Active: equip.js");

module.exports = (bot) => {

  // ==========================================
  // ⚔️ /equip [weapon_identifier] - LOADOUT GATE
  // ==========================================
  bot.onText(/\/equip(?:\s+(.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id.toString(); // Group-Safe User Boundary Lock

    // Pulling user framework state from centralized engine hook
    const player = bot.getPlayerData ? bot.getPlayerData(userId) : null;
    if (!player) return;

    // Strict safety assertions for data structure boundaries
    if (!player.inventory || !Array.isArray(player.inventory)) player.inventory = [];

    const inputArg = match[1] ? match[1].trim() : "";

    if (!inputArg) {
      return bot.sendMessage(chatId, 
        `⚔️ **VELIX OS | ARSENAL EQUIPPING MATRIX**\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `❌ **Syntax Error:** Loadout configuration identifier is missing.\n` +
        `👉 *Execution Prompt:* \`/equip weapon_<id>\` (e.g., \`/equip weapon_1\`)\n\n` +
        `💡 *Note:* Check your available weapons inside your personal storage grid using \`/inventory\`.` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
        { parse_mode: "Markdown" }
      );
    }

    // Advanced Matrix Scan: Supports both 'weapon_1' string format and raw integer indices
    const targetWeapon = player.inventory.find((item) => {
      if (!item) return false;
      
      // If inventory contains raw string items
      if (typeof item === "string") {
        return item.toLowerCase().includes(inputArg.toLowerCase());
      }
      
      // If inventory contains system standardized structured objects
      const weaponIdStr = item.id ? String(item.id).toLowerCase() : "";
      const cleanInput = inputArg.toLowerCase();
      
      return weaponIdStr === cleanInput || 
             weaponIdStr.replace("weapon_", "") === cleanInput || 
             (item.name && item.name.toLowerCase().includes(cleanInput));
    });

    if (!targetWeapon) {
      return bot.sendMessage(chatId, `❌ **Deployment Refused:** Specified armament signature was not found within your linked warehouse manifests. Purchase items via \`/buy\` first.`);
    }

    // Standardizing object construction parameters before slot locking
    const standardizedWeaponObj = {
      id: targetWeapon.id || `weapon_linked`,
      name: targetWeapon.name || (typeof targetWeapon === "string" ? targetWeapon : "Standard Nichirin Blade"),
      damage: parseInt(targetWeapon.damage, 10) || 50
    };

    // Routing lethal output parameters directly to profile combat grids
    player.equippedWeapon = standardizedWeaponObj;

    // Syncing updates to primary sub-ledger pipeline channels
    if (bot.savePlayerData) {
      bot.savePlayerData(userId, player);
    }

    bot.sendMessage(
      chatId,
      `⚔️ **VELIX OS | ARSENAL DEPLOYMENT SUCCESS**\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `Tactical loadout synced. Combat vectors re-routed to your primary offensive array:\n\n` +
      `🔺 **Active Armament:** \`${standardizedWeaponObj.name}\`\n` +
      `🔺 **Lethality Scaling:** \`+${standardizedWeaponObj.damage.toLocaleString()} DMG\`\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `🔥 *Your combat capabilities are now adjusted for operational deployments and live battles!*`,
      { parse_mode: "Markdown" }
    );
  });

};
