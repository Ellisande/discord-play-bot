const Discord = require("discord.io");
const winston = require("winston");
const _ = require("lodash");
const admin = require("firebase-admin");
require("./api");
const { handleMessage } = require("./bot/messageHandler");
const { handlePresence } = require("./bot/presenceHandler");

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

bot.on("presence", (user, userId, status, game, event) =>
  handlePresence({
    user,
    userId,
    status,
    game,
    event,
    db
  })
);
