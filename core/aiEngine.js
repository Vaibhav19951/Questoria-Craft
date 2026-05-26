require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash-latest",
});

async function askJarvis(prompt) {

  try {

    const result = await model.generateContent(
      `You are Jarvis, a smart AI assistant inside a Demon Slayer RPG Telegram bot.
Keep replies short, helpful, cool, and human-like.

User: ${prompt}`
    );

    return result.response.text();

  } catch (err) {

    console.log("JARVIS ERROR:", err);

    // Quota exceeded
    if (err.status === 429) {
      return "⚠️ Jarvis is overloaded right now. Try again later.";
    }

    // Invalid API
    if (err.status === 401) {
      return "⚠️ Jarvis authentication failed.";
    }

    // Model issue
    if (err.status === 404) {
      return "⚠️ Jarvis model configuration error.";
    }

    // Generic fallback
    return "⚠️ Jarvis is currently offline.";
  }
}

module.exports = askJarvis;
