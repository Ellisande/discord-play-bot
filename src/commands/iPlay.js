const { Command } = require("./command");
const { addPlayer, ALREADY_PLAYS } = require("../store/store");
const _ = require("lodash");

const iPlayCommand = new Command({
  name: "I Play",
  command: /i play /gi,
  example: "I play dauntless",
  handler: ({ channelId, message, userId, db, bot, logger }) => {
    const gameName = message.toLowerCase();
    const playerUpdatePromise = addPlayer(db, channelId, gameName, userId);
    return playerUpdatePromise
      .then(() => {
        logger.info(`player ${userId} now plays ${gameName}`);
        bot.sendMessage({
          to: channelId,
          message: `<@${userId}> is now playing ${gameName}`
        });
      })
      .catch(error => {
        logger.error(error);
        logger.debug(`Could not add player ${userId} to ${gameName}`);
        if (error === ALREADY_PLAYS) {
          logger.debug(`${userId} already plays ${gameName}`);
          bot.sendMessage({
            to: channelId,
            message: `<@${userId}> already plays ${gameName}`
          });
        }
      });
  }
});

module.exports = { iPlayCommand };
