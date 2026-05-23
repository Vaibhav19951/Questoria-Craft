const START_IMG =
  "https://i.pinimg.com/736x/e1/97/3e/e1973e8421e69bc09f731b60f5102d97.jpg";

const HARU_IMG =
  "https://pic-link-bot.lovable.app/i/telegram-1779346403935-c002fd05.jpg";

const SORA_IMG =
  "https://pic-link-bot.lovable.app/i/telegram-1779346551992-24806470.jpg";

const characters = [
  // 🌊 Water Hashira
  {
    id: "giyu",
    name: "Giyu Tomioka",
    anime: "Demon Slayer",
    personality: ["calm", "stoic", "serious"],
    description: "The Water Hashira known for his quiet personality and deadly precision.",
    abilities: [
      "Water Breathing",
      "11th Form: Dead Calm",
      "Enhanced Reflexes"
    ],
    rank: "Hashira",
    hp: 300,
    attack: 43,
    defense: 26,
    speed: 41,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345152982-e7ffe560.jpg"
  },

  // 🔥 Flame Hashira
  {
    id: "rengoku",
    name: "Kyojuro Rengoku",
    anime: "Demon Slayer",
    personality: ["energetic", "honorable", "kind"],
    description: "The Flame Hashira who fights with passion and unwavering spirit.",
    abilities: [
      "Flame Breathing",
      "Ninth Form: Rengoku",
      "Immense Strength"
    ],
    rank: "Hashira",
    hp: 320,
    attack: 45,
    defense: 28,
    speed: 38,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345219885-aaa4a578.jpg"
  },

  // ⚡️ Thunder Hashira
  {
    id: "tengen",
    name: "Tengen Uzui",
    anime: "Demon Slayer",
    personality: ["flashy", "confident", "loud"],
    description: "The Sound Hashira who values flamboyance and speed in battle.",
    abilities: [
      "Sound Breathing",
      "Explosive Techniques",
      "Enhanced Hearing"
    ],
    rank: "Hashira",
    hp: 310,
    attack: 44,
    defense: 27,
    speed: 42,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345280404-781df8a7.jpg"
  },

  // 🌸 Love Hashira
  {
    id: "mitsuri",
    name: "Mitsuri Kanroji",
    anime: "Demon Slayer",
    personality: ["loving", "emotional", "cheerful"],
    description: "The Love Hashira with incredible flexibility and unique sword skills.",
    abilities: [
      "Love Breathing",
      "Flexible Sword",
      "Enhanced Agility"
    ],
    rank: "Hashira",
    hp: 290,
    attack: 40,
    defense: 24,
    speed: 43,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345360205-8fde18e4.jpg"
  },

  // 🐍 Serpent Hashira
  {
    id: "obanai",
    name: "Obanai Iguro",
    anime: "Demon Slayer",
    personality: ["strict", "loyal", "harsh"],
    description: "The Serpent Hashira who enforces discipline among Demon Slayers.",
    abilities: [
      "Serpent Breathing",
      "Flexible Movement",
      "Keen Vision"
    ],
    rank: "Hashira",
    hp: 280,
    attack: 39,
    defense: 23,
    speed: 40,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345388521-c0d312b8.jpg"
  },

  // 🪨 Stone Hashira
  {
    id: "gyomei",
    name: "Gyomei Himejima",
    anime: "Demon Slayer",
    personality: ["gentle", "spiritual", "strong"],
    description: "The strongest Hashira with immense physical power and faith.",
    abilities: [
      "Stone Breathing",
      "Chain Axe Combat",
      "Immense Strength"
    ],
    rank: "Hashira",
    hp: 350,
    attack: 50,
    defense: 35,
    speed: 30,
    rarity: "SSR",
    image: "https://t.me/Image_LinkBot?start=7547794741"
  },

  // 🌫 Mist Hashira
  {
    id: "muichiro",
    name: "Muichiro Tokito",
    anime: "Demon Slayer",
    personality: ["forgetful", "quiet", "genius"],
    description: "A prodigy Hashira who mastered Mist Breathing at a young age.",
    abilities: [
      "Mist Breathing",
      "Obscuring Clouds",
      "Extreme Speed"
    ],
    rank: "Hashira",
    hp: 270,
    attack: 42,
    defense: 22,
    speed: 45,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345649988-506e1d3d.jpg"
  },

  // 🦋 Insect Hashira
  {
    id: "shinobu",
    name: "Shinobu Kocho",
    anime: "Demon Slayer",
    personality: ["calm", "intelligent", "sadistic"],
    description: "The Insect Hashira who uses poison instead of brute strength.",
    abilities: [
      "Insect Breathing",
      "Poison Attacks",
      "Medical Knowledge"
    ],
    rank: "Hashira",
    hp: 250,
    attack: 38,
    defense: 20,
    speed: 44,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345754042-2e9abcf7.jpg"
  },

  // 🌪 Wind Hashira
  {
    id: "sanemi",
    name: "Sanemi Shinazugawa",
    anime: "Demon Slayer",
    personality: ["aggressive", "hot-headed", "loyal"],
    description: "The Wind Hashira with extreme combat instincts and endurance.",
    abilities: [
      "Wind Breathing",
      "Rapid Attacks",
      "Battle Instinct"
    ],
    rank: "Hashira",
    hp: 305,
    attack: 46,
    defense: 25,
    speed: 41,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345789123-b0eb504a.jpg"
  },

  // 🔰 Lower Rank Slayers
  {
    id: "kanao",
    name: "Kanao Tsuyuri",
    anime: "Demon Slayer",
    personality: ["quiet", "emotionless", "loyal"],
    description: "A skilled swordswoman trained by Shinobu.",
    abilities: [
      "Flower Breathing",
      "Enhanced Vision",
      "Precision Attacks"
    ],
    rank: "Tsuguko",
    hp: 180,
    attack: 32,
    defense: 18,
    speed: 35,
    rarity: "SR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345827680-5e8aa125.jpg"
  },

  // ❄️ Frost Hashira (Custom)
  {
    id: "akari",
    name: "Akari Yukimura",
    anime: "Demon Slayer",
    personality: ["calm", "elegant", "ruthless"],
    description: "The Frost Hashira who freezes enemies before they can react.",
    abilities: [
      "Frost Breathing",
      "Ice Mirror",
      "Blizzard Slash"
    ],
    rank: "Hashira",
    hp: 315,
    attack: 42,
    defense: 30,
    speed: 40,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345887171-b1efb23c.jpg"
  },

  // 🌑 Shadow Slayer (Custom)
  {
    id: "kuro",
    name: "Kuro Hayashi",
    anime: "Demon Slayer",
    personality: ["silent", "mysterious", "cold"],
    description: "A rogue demon slayer who uses shadow-based techniques.",
    abilities: [
      "Shadow Breathing",
      "Silent Step",
      "Night Slash"
    ],
    rank: "Kinoe",
    hp: 210,
    attack: 36,
    defense: 19,
    speed: 45,
    rarity: "SR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346031463-1de7c939.jpg"
  },

  // ⚡️ Storm Hashira (Custom)
  {
    id: "raijin",
    name: "Raijin Takeda",
    anime: "Demon Slayer",
    personality: ["aggressive", "loud", "fearless"],
    description: "A Hashira who combines thunder and wind into storm attacks.",
    abilities: [
      "Storm Breathing",
      "Thunder Cyclone",
      "Sky Breaker"
    ],
    rank: "Hashira",
    hp: 330,
    attack: 47,
    defense: 27,
    speed: 43,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346085384-6570df24.jpg"
  },

  // 🌸 Bloom Slayer (Custom)
  {
    id: "hana",
    name: "Hana Mizuno",
    anime: "Demon Slayer",
    personality: ["kind", "cheerful", "brave"],
    description: "A gentle fighter who uses flower-based illusions.",
    abilities: [
      "Bloom Breathing",
      "Petal Dance",
      "Blossom Strike"
    ],
    rank: "Tsuguko",
    hp: 170,
    attack: 29,
    defense: 18,
    speed: 34,
    rarity: "SR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346108792-e6697c48.jpg"
  },

  // 🔥 Ash Demon Slayer (Custom)
  {
    id: "kaen",
    name: "Kaen Ryuji",
    anime: "Demon Slayer",
    personality: ["hot-headed", "determined", "loyal"],
    description: "A former trainee of Flame Breathing who created his own Ash style.",
    abilities: [
      "Ash Breathing",
      "Burning Veil",
      "Smokescreen Slash"
    ],
    rank: "Kanoe",
    hp: 190,
    attack: 33,
    defense: 21,
    speed: 28,
    rarity: "SR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346174880-db9214fd.jpg"
  },

  // 🌌 Cosmic Hashira (Custom - OP character)
  {
    id: "orion",
    name: "Orion Kazuki",
    anime: "Demon Slayer",
    personality: ["wise", "calm", "detached"],
    description: "A legendary Hashira said to wield the power of the stars.",
    abilities: [
      "Cosmic Breathing",
      "Starfall",
      "Galaxy Slice"
    ],
    rank: "Hashira",
    hp: 360,
    attack: 52,
    defense: 35,
    speed: 38,
    rarity: "UR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346196278-50a29c00.jpg"
  },

  // 🌌 Witch (Custom - OP character)
  {
    id: "Shoko",
    name: "Shoko Nobara",
    anime: "Demon Slayer",
    personality: ["wise", "calm", "kind"],
    description: "A legendary Witch Only can access by Administrator.",
    abilities: [
      "Admin Menu",
      "1000 cut",
      "Bot Slice"
    ],
    rank: "GoD",
    hp: 4000,
    attack: 520,
    defense: 350,
    speed: 380,
    rarity: "SSR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779345976501-074dd29d.jpg"
  },

  // 🟢 Mizunoto Rank (Beginner)
  {
    id: "daichi",
    name: "Daichi Sato",
    anime: "Demon Slayer",
    personality: ["brave", "reckless", "loyal"],
    description: "A rookie demon slayer still learning control over his breathing.",
    abilities: [
      "Basic Water Breathing",
      "Quick Slash"
    ],
    rank: "Mizunoto",
    hp: 80,
    attack: 12,
    defense: 8,
    speed: 10,
    rarity: "Common",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346302261-fbcf3a7b.jpg"
  },

  // 🟢 Mizunoto Rank
  {
    id: "yuki",
    name: "Yuki Tanaka",
    anime: "Demon Slayer",
    personality: ["kind", "timid", "focused"],
    description: "A careful fighter who prioritizes defense over attack.",
    abilities: [
      "Basic Defense Form",
      "Evade"
    ],
    rank: "Mizunoto",
    hp: 90,
    attack: 9,
    defense: 14,
    speed: 11,
    rarity: "Common",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346347304-ccbf990b.jpg"
  },

  // 🔵 Mizunoe Rank
  {
    id: "haru",
    name: "Haru Kobayashi",
    anime: "Demon Slayer",
    personality: ["calm", "disciplined", "quiet"],
    description: "A steady swordsman with improved breathing control.",
    abilities: [
      "Water Breathing 1st Form",
      "Flowing Strike"
    ],
    rank: "Mizunoe",
    hp: 110,
    attack: 16,
    defense: 12,
    speed: 14,
    rarity: "Common",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346403935-c002fd05.jpg"
  },

  // 🔵 Mizunoe Rank
  {
    id: "ren",
    name: "Ren Ishida",
    anime: "Demon Slayer",
    personality: ["smart", "strategic", "serious"],
    description: "Uses tactics to outmaneuver demons rather than brute force.",
    abilities: [
      "Trap Setting",
      "Precision Slash"
    ],
    rank: "Mizunoe",
    hp: 100,
    attack: 18,
    defense: 11,
    speed: 15,
    rarity: "Common",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346515208-9714775f.jpg"
  },

  // 🟡 Kanoto Rank
  {
    id: "sora",
    name: "Sora Aizawa",
    anime: "Demon Slayer",
    personality: ["energetic", "fast", "competitive"],
    description: "A quick fighter specializing in speed-based attacks.",
    abilities: [
      "Wind Breathing (Basic)",
      "Dash Strike"
    ],
    rank: "Kanoto",
    hp: 120,
    attack: 20,
    defense: 13,
    speed: 22,
    rarity: "Uncommon",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346551992-24806470.jpg"
  },

  // 🟡 Kanoto Rank
  {
    id: "mei",
    name: "Mei Kuroda",
    anime: "Demon Slayer",
    personality: ["cheerful", "supportive", "brave"],
    description: "A support-type slayer who boosts allies.",
    abilities: [
      "Healing Breath",
      "Encourage"
    ],
    rank: "Kanoto",
    hp: 115,
    attack: 14,
    defense: 16,
    speed: 13,
    rarity: "Uncommon",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346453156-ec74d288.jpg"
  },

  // 🟠 Kanoe Rank
  {
    id: "takumi",
    name: "Takumi Fujiwara",
    anime: "Demon Slayer",
    personality: ["determined", "focused", "quiet"],
    description: "A skilled fighter close to Hashira-level potential.",
    abilities: [
      "Flame Breathing (Advanced)",
      "Blazing Slash"
    ],
    rank: "Kanoe",
    hp: 150,
    attack: 26,
    defense: 18,
    speed: 20,
    rarity: "SR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346608545-019f096f.jpg"
  },

  // 🟠 Kanoe Rank
  {
    id: "rika",
    name: "Rika Hoshino",
    anime: "Demon Slayer",
    personality: ["cold", "precise", "independent"],
    description: "A precise swordswoman with deadly accuracy.",
    abilities: [
      "Ice Breathing (Basic)",
      "Frozen Strike"
    ],
    rank: "Kanoe",
    hp: 140,
    attack: 24,
    defense: 17,
    speed: 21,
    rarity: "SR",
    image: "https://pic-link-bot.lovable.app/i/telegram-1779346662082-72f05640.jpg"
  }
];

module.exports = {
  characters,
  START_IMG,
  HARU_IMG,
  SORA_IMG
};