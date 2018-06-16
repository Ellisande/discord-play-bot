const { Command } = require("./command");
const { docOrDefault } = require("../firestoreUtils");

const toMentions = playerId => `<@${playerId}>`;

const buildWhoPlaysMessage = (players, gameName) =>
  `${gameName} players: ${players.map(toMentions).join(", ")}`;

const sendMessage = (bot, channelId, message) =>
  bot.sendMessage({
    to: channelId,
    message
  });

const whoPlaysCommand = new Command({
  command: "who_plays",
  handler: ({ db, channelId, message: gameName, bot, logger }) => {
    const gameDoc = db.doc(`/channels/${channelId}/games/${gameName}`);
    logger.info(`Fetching players for ${gameName}`);
    return gameDoc
      .get()
      .then(docOrDefault([]))
      .then(game => game.players)
      .then(players => buildWhoPlaysMessage(players, gameName))
      .then(message => sendMessage(bot, channelId, message));
  }
});

module.exports = { whoPlaysCommand };
