const { Command } = require("./command");
const { removePlayer, DOES_NOT_PLAY } = require("../store/store");
const _ = require("lodash");

const quitCommand = new Command({
  name: "I Quit",
  command: /i quit /gi,
  example: "I quit dauntless",
  handler: ({ channelId, message, userId, guildId, db, bot, logger }) => {
    const gameName = message.toLowerCase();
    const playerUpdatePromise = removePlayer(db, guildId, gameName, userId);
    return playerUpdatePromise
      .then(() => {
        logger.info(`player ${userId} no longer plays ${gameName}`);
        bot.sendMessage({
          to: channelId,
          message: `<@${userId}> is no longer playing ${gameName}`
        });
      })
      .catch(error => {
        logger.debug(`Could not remove player ${userId} from ${gameName}`);
        if (error === DOES_NOT_PLAY) {
          logger.debug(`${userId} does not play ${gameName}`);
          bot.sendMessage({
            to: channelId,
            message: `<@${userId}> does not play ${gameName}`
          });
        }
      });
  }
});

module.exports = { quitCommand };
