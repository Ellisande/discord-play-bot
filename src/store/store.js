const _ = require("lodash");
const winston = require("winston");
const { update } = require("../firestoreUtils");

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});
const logLevel = process.env.LOG_LEVEL || "debug";
logger.level = logLevel;

const ALREADY_PLAYS = Symbol("ALREADY_PLAYS");
const ALREADY_WATCHED = Symbol("ALREADY_WATCHED");

const addPlayer = (db, guildId, game, playerId) => {
  const gameName = game.toLowerCase();
  updateGame = update(db)(`/guilds/${guildId}/games/${gameName}`);
  return updateGame(oldGame => {
    const oldPlayers = _.get(oldGame, "players", []);
    if (oldPlayers.includes(playerId)) {
      logger.info(`player ${playerId} already plays ${gameName}`);
      throw ALREADY_PLAYS;
    }
    const newPlayers = [...oldPlayers, playerId];
    logger.debug(`Updating player state from ${oldPlayers} to ${[newPlayers]}`);
    return { players: newPlayers };
  });
};

const getWatchedUsers = (db, guildId) => {
  const guildRef = db.doc(`guilds/${guildId}`);
  return guildRef.get().then(doc => {
    if (!doc.exists) {
      return [];
    }
    const guild = doc.data();
    if (!guild) {
      return [];
    }
    return guild.watched_users || [];
  });
};

const addWatchedUser = (db, guildId, userId) => {
  const watchedUsers = db.doc(`guilds/${guildId}`);
  const updateWatched = update(db)(watchedUsers);
  return updateWatched((oldWatched = { watched_users: [] }) => {
    if (oldWatched.watched_users.includes(userId)) {
      throw ALREADY_WATCHED;
    }
    return {
      ...oldWatched,
      watched_users: [...oldWatched.watched_users, userId]
    };
  });
};

module.exports = {
  addPlayer,
  ALREADY_PLAYS,
  getWatchedUsers,
  addWatchedUser,
  ALREADY_WATCHED
};
