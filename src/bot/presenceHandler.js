const _ = require("lodash");
const winston = require("winston");
const { extractGuildId } = require("../discordUtils");
const { getWatchedUsers, addPlayer, ALREADY_PLAYS } = require("../store/store");

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});
logger.level = process.env.LOG_LEVEL || "debug";

const handlePresence = ({ user, userId, status, game, event, db }) => {
  const guildId = extractGuildId(event);
  const watchedPromise = getWatchedUsers(db, guildId);
  const gameName = game ? game.name : "";

  if (_.isEmpty(gameName)) {
    logger.debug(
      `Did not track game for watched user ${userId} because the game name was undefined`
    );
    return Promise.resolve();
  }
  if (game.streaming || game.url) {
    logger.debug(
      `Did not track game for watched user ${userId} because they were streaming`
    );
    return Promise.resolve();
  }
  const addPlayerPromise = watchedPromise.then(watchedUsers => {
    if (watchedUsers.includes(userId)) {
      logger.debug(
        `Attempting to add player ${userId} to game ${gameName} for guild ${guildId}`
      );
      return addPlayer(db, guildId, gameName, userId);
    }
    logger.debug(`${userId} in ${guildId} is not being watched`);
    return Promise.reject();
  });
  return addPlayerPromise.then(
    () => logger.debug(`player ${userId} now plays ${gameName}`),
    error => {
      if (error === ALREADY_PLAYS) {
        logger.debug(`${userId} already plays ${gameName}`);
        return;
      }
    }
  );
};

module.exports = { handlePresence };
