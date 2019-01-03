const { Command } = require("./command");
const { sampleSize } = require("lodash");

const sendMessage = (bot, channelId, message) =>
  bot.sendMessage({
    to: channelId,
    message
  });

const buildGamesMessage = names =>
  names.map((value, index) => `${index + 1}. ${value}`).join("\n");

const gamesCommand = new Command({
  name: "All Games",
  command: /(what|is|who|).*playing.*/gi,
  example: "what games are people playing?",
  handler: ({ db, bot, channelId, guildId }) => {
    const gameRef = db.collection(`guilds/${guildId}/games`);
    return gameRef
      .get()
      .then(gameCollection => gameCollection.docs)
      .then(games => games.map(game => game.id))
      .then(gameNames => {
        if (gameNames.length <= 0) {
          return "No one plays any games. Life is sadness";
        }
        const sample = sampleSize(gameNames, 5);
        return `Some games played in this channel:
          ${buildGamesMessage(sample)}`;
      })
      .then(message => sendMessage(bot, channelId, message));
  }
});

module.exports = { gamesCommand };
