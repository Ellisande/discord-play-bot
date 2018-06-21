const Discord = require("discord.io");
const winston = require("winston");
const _ = require("lodash");
const admin = require("firebase-admin");
require("./api");
const { whoPlaysCommand } = require("./commands/whoPlays");
const { iPlayCommand } = require("./commands/iPlay");
const { gamesCommand } = require("./commands/games");
const { whatsNewCommand } = require("./commands/whatsNew");

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
  whatsNewCommand
];

const playBotId = "456628305911873536";
const botMentionMatcher = /<@456628305911873536> ?/;

bot.on("message", (user, userID, channelID, originalMessage, event) => {
  const enableTestCommands = channelID == "457011209372303371";

  if (userID == playBotId) {
    logger.debug("Message was from play-bot himself");
    return;
  }

  // if (channelID != "457011209372303371") {
  //   logger.debug("Only test for now");
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
