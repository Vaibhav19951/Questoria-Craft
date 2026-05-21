const demons = [
  // =========================
  // 🩸 NORMAL DEMONS
  // =========================
  {
    id: "demon_1",
    name: "Temple Demon",
    rank: "Low",
    type: "Attacker",
    hp: 70,
    attack: 12,
    defense: 5,
    speed: 10,
    abilities: ["Claw Slash", "Savage Bite"],
    rarity: "Common",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779349418381-529fdeba.jpg"
  },
  {
    id: "demon_2",
    name: "Swamp Demon",
    rank: "Low",
    type: "Stealth",
    hp: 80,
    attack: 13,
    defense: 6,
    speed: 14,
    abilities: ["Mud Trap", "Swamp Grab"],
    rarity: "Common",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779349450080-2d7bcd3d.jpg"
  },
  {
    id: "demon_3",
    name: "Tongue Demon",
    rank: "Low",
    type: "Speed",
    hp: 75,
    attack: 14,
    defense: 5,
    speed: 16,
    abilities: ["Tongue Whip", "Leap"],
    rarity: "Common",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779349544295-babc10f0.jpg"
  },
  {
    id: "demon_4",
    name: "Spider Demon Son",
    rank: "Low",
    type: "Poison",
    hp: 90,
    attack: 15,
    defense: 7,
    speed: 12,
    abilities: ["Poison Fang", "Spider Jump"],
    rarity: "Common",
    image: "https://i.pinimg.com/736x/5f/d9/76/5fd9764fe5aa029d320c8051f625f946.jpg"
  },
  {
    id: "demon_5",
    name: "Spider Demon Daughter",
    rank: "Low",
    type: "Control",
    hp: 95,
    attack: 13,
    defense: 8,
    speed: 11,
    abilities: ["Web Control", "Paralyze"],
    rarity: "Common",
    image: "https://i.pinimg.com/736x/28/56/57/285657c7a5678ee2fadda93de342a892.jpg"
  },
  {
    id: "demon_6",
    name: "Horned Demon",
    rank: "Low",
    type: "Tank",
    hp: 110,
    attack: 16,
    defense: 12,
    speed: 6,
    abilities: ["Horn Charge"],
    rarity: "Common",
    image: "https://i.pinimg.com/736x/df/a7/bd/dfa7bd3e1a38ee5ae7615e7e4ff98d8e.jpg"
  },
  {
    id: "demon_10",
    name: "Hand Demon",
    rank: "Low",
    type: "Tank",
    hp: 110,
    attack: 16,
    defense: 12,
    speed: 6,
    abilities: ["Hand Charge"],
    rarity: "Common",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779349375431-bc6c45db.jpg"
  },

  // =========================
  // 🔥 STRONG DEMONS
  // =========================
  {
    id: "demon_7",
    name: "Kyogai",
    rank: "Strong",
    type: "Control",
    hp: 150,
    attack: 22,
    defense: 13,
    speed: 14,
    abilities: ["Drum Rotation", "Shockwave"],
    rarity: "Uncommon",
    image: "https://i.pinimg.com/1200x/1a/23/24/1a23242df6b2cc8a0269c1bc9110c0f5.jpg"
  },
  {
    id: "demon_8",
    name: "Rokuro",
    rank: "Strong",
    type: "Attacker",
    hp: 140,
    attack: 24,
    defense: 12,
    speed: 15,
    abilities: ["Blood Burst"],
    rarity: "Uncommon",
    image: "https://i.pinimg.com/1200x/3c/f9/1c/3cf91c27a075a5fa7267f76e0bc01293.jpg"
  },
  {
    id: "demon_9",
    name: "Mukago",
    rank: "Strong",
    type: "Speed",
    hp: 135,
    attack: 23,
    defense: 11,
    speed: 20,
    abilities: ["Night Dash"],
    rarity: "Uncommon",
    image: "https://i.pinimg.com/736x/4c/cf/15/4ccf15ca730a2db1a3bbc1c93dbf6556.jpg"
  },

  // =========================
  // 🌙 LOWER MOONS
  // =========================
  {
    id: "lower_moon_6",
    name: "Kamanue",
    rank: "Lower Moon 6",
    type: "Speed",
    hp: 170,
    attack: 26,
    defense: 15,
    speed: 22,
    abilities: ["Fear Dash", "Rapid Claw"],
    rarity: "Rare",
    image: "https://i.pinimg.com/736x/4b/b4/87/4bb487db4c3f6527697dd00976990dbb.jpg"
  },
  {
    id: "lower_moon_5",
    name: "Rui",
    rank: "Lower Moon 5",
    type: "Control",
    hp: 220,
    attack: 30,
    defense: 18,
    speed: 20,
    abilities: ["Thread Cage", "Cutting Web"],
    rarity: "Rare",
    image: "https://i.pinimg.com/736x/34/e2/d2/34e2d26fe387dcb051019b880519b2ba.jpg"
  },
  {
    id: "lower_moon_4",
    name: "Mukago",
    rank: "Lower Moon 4",
    type: "Speed",
    hp: 190,
    attack: 28,
    defense: 14,
    speed: 24,
    abilities: ["Moon Dash"],
    rarity: "Rare",
    image: "https://i.pinimg.com/736x/73/ba/92/73ba9296be0faa2c526a2b5d69d7b3e1.jpg"
  },
  {
    id: "lower_moon_3",
    name: "Wakuraba",
    rank: "Lower Moon 3",
    type: "Speed",
    hp: 200,
    attack: 29,
    defense: 16,
    speed: 26,
    abilities: ["Flash Movement"],
    rarity: "Rare",
    image: "https://i.pinimg.com/736x/57/29/b6/5729b6e805809444dbd6e9fc7f6711bd.jpg"
  },
  {
    id: "lower_moon_2",
    name: "Rokuro",
    rank: "Lower Moon 2",
    type: "Attacker",
    hp: 215,
    attack: 33,
    defense: 17,
    speed: 18,
    abilities: ["Blood Explosion"],
    rarity: "Rare",
    image: "https://i.pinimg.com/1200x/bb/84/2e/bb842e1e78397c7ca8c34388628344f5.jpg"
  },
  {
    id: "lower_moon_1",
    name: "Enmu",
    rank: "Lower Moon 1",
    type: "Illusion",
    hp: 260,
    attack: 36,
    defense: 20,
    speed: 18,
    abilities: ["Sleep Blood Art", "Dream Trap"],
    rarity: "Epic",
    image: "https://i.pinimg.com/736x/9b/3f/e6/9b3fe6d6a42d89d43c93f185e6e56405.jpg"
  },

  // =========================
  // ☠️ UPPER MOONS
  // =========================
  {
    id: "upper_moon_6",
    name: "Gyutaro",
    rank: "Upper Moon 6",
    type: "Poison",
    hp: 320,
    attack: 45,
    defense: 25,
    speed: 28,
    abilities: ["Blood Sickles", "Poison Slash"],
    rarity: "Epic",
    image: "https://i.pinimg.com/736x/cd/f4/f7/cdf4f7e4c73ec905a3ea511a21986b95.jpg"
  },
  {
    id: "upper_moon_6b",
    name: "Daki",
    rank: "Upper Moon 6",
    type: "Control",
    hp: 290,
    attack: 40,
    defense: 22,
    speed: 26,
    abilities: ["Obi Slash", "Ribbon Cage"],
    rarity: "Epic",
    image: "https://i.pinimg.com/1200x/cd/12/a5/cd12a5b50d5e3871c7ba6cfbe60cf4ef.jpg"
  },
  {
    id: "upper_moon_5",
    name: "Gyokko",
    rank: "Upper Moon 5",
    type: "Magic",
    hp: 360,
    attack: 48,
    defense: 28,
    speed: 22,
    abilities: ["Fish Summon", "Vase Warp"],
    rarity: "Epic",
    image: "https://i.pinimg.com/736x/9d/e0/f0/9de0f00261e5cfd6d04b8bf4d54459d7.jpg"
  },
  {
    id: "upper_moon_4",
    name: "Hantengu",
    rank: "Upper Moon 4",
    type: "Split",
    hp: 400,
    attack: 50,
    defense: 30,
    speed: 24,
    abilities: ["Emotion Clones", "Lightning Spear"],
    rarity: "Legendary",
    image: "https://i.pinimg.com/736x/68/1d/fc/681dfca7075685cbb7e525a4224c9b2c.jpg"
  },
  {
    id: "upper_moon_3",
    name: "Akaza",
    rank: "Upper Moon 3",
    type: "Martial",
    hp: 500,
    attack: 62,
    defense: 35,
    speed: 34,
    abilities: ["Destructive Death", "Compass Needle"],
    rarity: "Legendary",
    image: "https://i.pinimg.com/736x/61/05/dc/6105dc802b7eb7edc70950810cc0ed6e.jpg"
  },
  {
    id: "upper_moon_2",
    name: "Doma",
    rank: "Upper Moon 2",
    type: "Ice",
    hp: 560,
    attack: 68,
    defense: 40,
    speed: 30,
    abilities: ["Frozen Lotus", "Ice Clone"],
    rarity: "Legendary",
    image: "https://i.pinimg.com/736x/83/c8/28/83c8282fb4abf1e5195a88e22932cb22.jpg"
  },
  {
    id: "upper_moon_1",
    name: "Kokushibo",
    rank: "Upper Moon 1",
    type: "Boss",
    hp: 700,
    attack: 82,
    defense: 50,
    speed: 36,
    abilities: ["Moon Breathing", "Crescent Blades"],
    rarity: "Mythic",
    image: "https://i.pinimg.com/736x/98/46/33/984633f2bd38bd2ad3a1a34b518c146e.jpg"
  },

  // =========================
  // 👑 FINAL BOSSES
  // =========================
  {
    id: "boss_1",
    name: "Kaigaku",
    rank: "Boss",
    type: "Lightning",
    hp: 450,
    attack: 58,
    defense: 30,
    speed: 32,
    abilities: ["Dark Thunder", "Thunder Breathing"],
    rarity: "Legendary",
    image: "https://i.pinimg.com/736x/f1/24/a2/f124a23030cce0f9d3303b975b73455a.jpg"
  },
  {
    id: "boss_2",
    name: "Nakime",
    rank: "Boss",
    type: "Control",
    hp: 520,
    attack: 55,
    defense: 38,
    speed: 24,
    abilities: ["Infinity Castle", "Biwa Shift"],
    rarity: "Legendary",
    image: "https://i.pinimg.com/736x/17/1b/ca/171bca6870b37ce607ee0083b9a7582b.jpg"
  },
  {
    id: "final_boss",
    name: "Muzan Kibutsuji",
    rank: "Demon King",
    type: "Final Boss",
    hp: 1000,
    attack: 100,
    defense: 60,
    speed: 45,
    abilities: [
      "Black Blood",
      "Tentacle Rampage",
      "Regeneration",
      "Shockwave"
    ],
    rarity: "Godly",
    image: "https://i.pinimg.com/736x/38/93/db/3893dba92490429e6403001630b92afc.jpg"
  }
];

module.exports = demons;
