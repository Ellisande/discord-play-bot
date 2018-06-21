const { Command } = require("./command");
const { docOrDefault } = require("../firestoreUtils");

const toMentions = playerId => `<@${playerId}>`;

const buildWhoPlaysMessage = (players, gameName) =>
  Object.keys(players).length == 0
    ? `No one plays ${gameName}... or at least they won't admit it`
    : `${gameName} players: ${players.map(toMentions).join(", ")}`;

const sendMessage = (bot, channelId, message) =>
  bot.sendMessage({
    to: channelId,
    message
  });

const whoPlaysCommand = new Command({
  name: "Who Plays",
  command: /(who is|does anyone|who) (plays?|playing) /gi,
  example: "who plays dauntless?",
  handler: ({ db, channelId, message: gameName, bot, logger }) => {
    const gameDoc = db.doc(`/channels/${channelId}/games/${gameName}`);
    logger.info(`Fetching players for ${gameName}`);
    return gameDoc
      .get()
      .then(docOrDefault({ players: [] }))
      .then(game => game.players)
      .then(players => buildWhoPlaysMessage(players, gameName))
      .then(message => sendMessage(bot, channelId, message));
  }
});

module.exports = { whoPlaysCommand };
