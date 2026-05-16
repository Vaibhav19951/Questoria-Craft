module.exports = {
  name: "battle",
  description: "Fight a demon",
  execute: async (ctx) => {
    const win = Math.random() > 0.5;

    if (win) {
      await ctx.reply("⚔️ You defeated the demon!");
    } else {
      await ctx.reply("💀 You lost the battle...");
    }
  }
};
