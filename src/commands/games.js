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
    return gameRef
      .get()
      .then(gameCollection => gameCollection.docs)
      .then(games => games.map(game => game.id))
      .then(
        gameNames =>
          gameNames.length > 0
            ? `Games played in this channel: ${gameNames.join(", ")}`
            : `No one plays any games. Life is saddness.`
      )
      .then(message => sendMessage(bot, channelId, message));
  }
});

module.exports = { gamesCommand };
