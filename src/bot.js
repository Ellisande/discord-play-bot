const Discord = require("discord.io");
const winston = require("winston");
const _ = require("lodash");
const admin = require("firebase-admin");
require("./api");
const { extractGuildId } = require("./discordUtils");
const { getWatchedUsers, addPlayer, ALREADY_PLAYS } = require("./store/store");
const { handleMessage } = require("./bot/messageHandler");

const discordAuth =
  process.env.NODE_ENV == "production" ? {} : require("../auth.json");

const firebaseCert = process.env.NODE_ENV
  ? JSON.parse(process.env.firebase_cert)
  : require("../firebaseCert.json");

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});
logger.level = "debug";

admin.initializeApp({
  credential: admin.credential.cert(firebaseCert)
});

const db = admin.firestore();

const bot = new Discord.Client({
  token: process.env.bot_token || discordAuth.token,
  autorun: true
});

bot.on("ready", event => {
  logger.info("Connected");
  logger.info("Logged in as");
  logger.info(`${bot.username} - (${bot.id})`);
});

bot.on("message", (user, userId, channelId, originalMessage, event) =>
  handleMessage({
    user,
    userId,
    channelId,
    originalMessage,
    event,
    bot,
    db
  })
);

bot.on("presence", (user, userID, status, game, event) => {
  // if (!isTestUser(userID)) {
  //   return;
  // }
  const guildId = extractGuildId(event);
  const watchedPromise = getWatchedUsers(db, guildId);
  const gameName = game ? game.name : "";
  // logger.debug(`The game is ${JSON.stringify(game)}`);

  if (_.isEmpty(gameName)) {
    logger.debug(
      `Did not track game for watched user ${userID} because the game name was undefined`
    );
    return;
  }
  if (game.streaming || game.url) {
    logger.debug(
      `Did not track game for watched user ${userID} because they were streaming`
    );
    return;
  }
  const addPlayerPromise = watchedPromise.then(watchedUsers => {
    if (watchedUsers.includes(userID)) {
      logger.debug(
        `Attempting to add player ${userID} to game ${gameName} for guild ${guildId}`
      );
      return addPlayer(db, guildId, gameName, userID);
    }
    logger.debug(`${userID} in ${guildId} is not being watched`);
    return Promise.reject();
  });
  return addPlayerPromise.then(
    () => logger.info(`player ${userID} now plays ${gameName}`),
    error => {
      if (error === ALREADY_PLAYS) {
        logger.debug(`${userID} already plays ${gameName}`);
        return;
      }
    }
  );
});
