const { Command } = require("./command");

const sendMessage = (bot, channelId, message) =>
  bot.sendMessage({
    to: channelId,
    message
  });

const gamesCommand = new Command({
  command: "games",
  handler: ({ db, bot, channelId }) => {
    const gameRef = db.collection(`channels/${channelId}/games`);
    gameRef
      .get()
      .then(games => games.docs)
      .then(games => games.map(game => game.id))
      .then(games => `Games played in this channel: ${games.join(", ")}`)
      .then(message => sendMessage(bot, channelId, message));
  }
});

module.exports = { gamesCommand };