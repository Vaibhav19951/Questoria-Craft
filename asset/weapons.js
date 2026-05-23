const weapons = [
  // ==========================================
  // 🟢 COMMON NICHIRIN BLADES
  // ==========================================
  {
    id: "nichirin_water",
    name: "Water Nichirin Blade",
    type: "Nichirin Sword",
    atk_bonus: 15,
    def_bonus: 5,
    spd_bonus: 5,
    crit_bonus: 2,
    cost: 500,
    rarity: "Common",
    description: "A deep blue blade that fluidly channels the momentum of Water Breathing."
  },
  {
    id: "nichirin_flower",
    name: "Flower Nichirin Blade",
    type: "Nichirin Sword",
    atk_bonus: 12,
    def_bonus: 8,
    spd_bonus: 10,
    crit_bonus: 3,
    cost: 550,
    rarity: "Common",
    description: "A light pink blade decorated with subtle floral patterns, optimized for graceful swiftness."
  },

  // ==========================================
  // 🟡 UNCOMMON / RARE BLADES
  // ==========================================
  {
    id: "nichirin_wind",
    name: "Wind Nichirin Blade",
    type: "Nichirin Sword",
    atk_bonus: 28,
    def_bonus: 0,
    spd_bonus: 18,
    crit_bonus: 5,
    cost: 1200,
    rarity: "Uncommon",
    description: "A green-streaked blade engineered for aggressive, whirlwind-velocity assaults."
  },
  {
    id: "nichirin_flame",
    name: "Flame Nichirin Blade",
    type: "Nichirin Sword",
    atk_bonus: 38,
    def_bonus: 10,
    spd_bonus: 2,
    crit_bonus: 6,
    cost: 1600,
    rarity: "Rare",
    description: "A crimson blade emblazoned with a wave-like flame profile, pulsing with intense thermal energy."
  },

  // ==========================================
  // ✨ SSR / HASHIRA SPECIALIZED WEAPONS
  // ==========================================
  {
    id: "cleavers_sound",
    name: "Twin Sound Cleavers",
    type: "Dual Blades",
    atk_bonus: 55,
    def_bonus: 15,
    spd_bonus: 25,
    crit_bonus: 10,
    cost: 4500,
    rarity: "SSR",
    description: "Massive, notched twin swords chained together, designed to create devastating sound-breathing concussions."
  },
  {
    id: "serpent_kris",
    name: "Serpent Coiled Blade",
    type: "Wavy Sword",
    atk_bonus: 48,
    def_bonus: 12,
    spd_bonus: 32,
    crit_bonus: 12,
    cost: 4600,
    rarity: "SSR",
    description: "A uniquely contorted, slithering blade that bypasses traditional enemy guard positions with ease."
  },
  {
    id: "insect_stinger",
    name: "Stinger Nichirin Needle",
    type: "Stinger",
    atk_bonus: 35,
    def_bonus: 5,
    spd_bonus: 45,
    crit_bonus: 20,
    cost: 4200,
    rarity: "SSR",
    description: "A heavily modified, cap-less blade incapable of slashing, optimized entirely for swift, lethal venom micro-injections."
  },
  {
    id: "stone_axe_chain",
    name: "Spiked Flail & Battle Axe",
    type: "Heavy Chain",
    atk_bonus: 75,
    def_bonus: 50,
    spd_bonus: -10,
    crit_bonus: 8,
    cost: 5500,
    rarity: "SSR",
    description: "An extremely heavy, unwieldy pairing forged from pure sunlight-infused iron, carrying unparalleled kinetic destructive potential."
  },

  // ==========================================
  // 🌌 MYTHICAL / EVOLVED WEAPONS
  // ==========================================
  {
    id: "nichirin_bright_red",
    name: "Bright Red Nichirin Blade",
    type: "Evolved Sword",
    atk_bonus: 120,
    def_bonus: 30,
    spd_bonus: 40,
    crit_bonus: 18,
    cost: 12000,
    rarity: "Mythical",
    description: "A blade superheated by raw grip strength, turning blood-red to permanently suppress demon regeneration capabilities."
  }
];

module.exports = { weapons };