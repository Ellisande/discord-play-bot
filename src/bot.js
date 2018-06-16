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

bot.on("message", (user, userID, channelID, message, event) => {
  const enableTestCommands = channelID == "457011209372303371";

  const commands = allCommands.filter(
    i => i.test == false || enableTestCommands
  );
  const command = message.split(" ")[0];

  if (command[0] != "!") {
    logger.debug("Message was not a command");
    return;
  }
  const gameName = message.replace(RegExp(`^${command} `), "");

  logger.info(`[${command}] with game ${gameName} from ${userID}`);

  const matchingCommand = commands.find(currentCommand =>
    currentCommand.matches(command)
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
  if (command == "!commands") {
    bot.sendMessage({
      to: channelID,
      message: `Available <@${bot.id}> commands: ${commands
        .map(i => "!" + i.command)
        .join(", ")}`
    });
  }
});
