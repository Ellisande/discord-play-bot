const { Command } = require("./command");

const sendMessage = (bot, channelId, message) =>
  bot.sendMessage({
    to: channelId,
    message
  });

const gamesCommand = new Command({
  name: "All Games",
  command: /(what|is|who|).*playing.*/gi,
  example: "what games are people playing?",
  handler: ({ db, bot, channelId, guildId }) => {
    const gameRef = db.collection(`guilds/${guildId}/games`);
    gameRef
      .get()
      .then(games => games.docs)
      .then(games => games.map(game => game.id))
      .then(games => `Games played in this channel: ${games.join(", ")}`)
      .then(message => sendMessage(bot, channelId, message));
  }
});

module.exports = { gamesCommand };
