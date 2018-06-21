const { Command } = require("./command");
const { update } = require("../firestoreUtils");
const _ = require("lodash");

const ALREADY_PLAYS = Symbol("Already Plays");

const iPlayCommand = new Command({
  name: "I Play",
  command: /i play /gi,
  example: "I play dauntless",
  handler: ({ channelId, message, userId, db, bot, logger }) => {
    const gameName = message.toLowerCase();
    const gameDoc = db.doc(`/channels/${channelId}/games/${gameName}`);
    const updateGame = update(db)(gameDoc);
    const playerUpdatePromise = updateGame(oldGame => {
      const oldPlayers = _.get(oldGame, "players", []);
      if (oldPlayers.includes(userId)) {
        logger.info(`player ${userId} already plays ${gameName}`);
        throw ALREADY_PLAYS;
      }
      const newPlayers = [...oldPlayers, userId];
      logger.debug(
        `Updating player state from ${oldPlayers} to ${[newPlayers]}`
      );
      return { players: newPlayers };
    });
    return playerUpdatePromise
      .then(() => {
        logger.info(`player ${userId} now plays ${gameName}`);
        bot.sendMessage({
          to: channelId,
          message: `<@${userId}> is now playing ${gameName}`
        });
      })
      .catch(error => {
        if (error === ALREADY_PLAYS) {
          bot.sendMessage({
            to: channelId,
            message: `<@${userId}> already plays ${gameName}`
          });
        }
      });
  }
});

module.exports = { iPlayCommand };
