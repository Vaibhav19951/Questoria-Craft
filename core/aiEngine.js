const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askJarvis(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You are Jarvis, a smart AI assistant inside a Demon Slayer RPG Telegram bot. Keep replies short, helpful, cool, and human-like.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 300,
    });

    return response.choices[0].message.content;

  } catch (err) {
    console.log("JARVIS ERROR:", err);

    return "⚠️ Jarvis is currently offline.";
  }
}

module.exports = askJarvis;
