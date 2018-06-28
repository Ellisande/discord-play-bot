const Discord = require("discord.io");
const winston = require("winston");
const _ = require("lodash");
const admin = require("firebase-admin");
require("./api");
const { whoPlaysCommand } = require("./commands/whoPlays");
const { iPlayCommand } = require("./commands/iPlay");
const { gamesCommand } = require("./commands/games");
const { whatsNewCommand } = require("./commands/whatsNew");
const { witnessMeCommand } = require("./commands/witnessMe");
const { extractGuildId } = require("./discordUtils");
const { getWatchedUsers, addPlayer, ALREADY_PLAYS } = require("./store/store");

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

const allCommands = [
  whoPlaysCommand,
  iPlayCommand,
  gamesCommand,
  whatsNewCommand,
  witnessMeCommand
];

const playBotId = "456628305911873536";
const botMentionMatcher = /<@456628305911873536> ?/;

const isTestChannel = channel => channel == "457011209372303371";
const isTestUser = user => user == "232704012070158336";

bot.on("message", (user, userID, channelID, originalMessage, event) => {
  const enableTestCommands = isTestChannel(channelID);
  const guildId = extractGuildId(event);

  if (userID == playBotId) {
    logger.debug("Message was from play-bot himself");
    return;
  }

  // if (!isTestChannel(channelID)) {
  //   logger.debug("Only test channel right now");
  //   return;
  // }

  const commands = allCommands.filter(
    i => i.test == false || enableTestCommands
  );

  if (!originalMessage.match(botMentionMatcher)) {
    logger.debug("Message was not a command");
    return;
  }

  const message = originalMessage.replace(botMentionMatcher, "");
  const matchingCommand = commands.find(currentCommand =>
    currentCommand.matches(message)
  );
  if (matchingCommand) {
    matchingCommand.handle({
      db,
      user,
      userId: userID,
      channelId: channelID,
      guildId,
      message,
      bot,
      event,
      logger
    });
  }
  if (message.match(/^commands/i)) {
    bot.sendMessage({
      to: channelID,
      message:
        "Try asking me:\n" +
        commands
          .map((i, index) => `[${index + 1}]: <@${playBotId}> ${i.example}`)
          .join("\n")
    });
  }
});

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
