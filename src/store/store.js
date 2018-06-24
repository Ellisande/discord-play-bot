const _ = require("lodash");
const winston = require("winston");
const { update } = require("../firestoreUtils");

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});
const logLevel = process.env.LOG_LEVEL || "debug";
logger.level = logLevel;

const ALREADY_PLAYS = Symbol("Already Plays");

const addPlayer = (db, guildId, game, playerId) => {
  const gameName = game.toLowerCase();
  const gameDoc = db.doc(`/guilds/${guildId}/games/${gameName}`);
  updateGame = update(db)(gameDoc);
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

module.exports = { addPlayer, ALREADY_PLAYS };
