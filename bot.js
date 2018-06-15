const Discord = require("discord.io");
const winston = require("winston");
const _ = require("lodash");
const admin = require("firebase-admin");

const discordAuth =
  process.env.NODE_ENV == "production" ? {} : require("./auth.json");

const firebaseCert = process.env.NODE_ENV
  ? proccess.env.firebaseCert
  : require("./firebaseCert.json");

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

const toMentions = playerId => `<@${playerId}>`;

const docOrDefault = defaultValue => doc => (doc.exists ? doc.data() : []);

const getPlayers = gameName => games => games[gameName];

const buildWhoPlaysMessage = (players, gameName) =>
  `${gameName} players: ${players.map(toMentions).join(", ")}`;

const sendMessage = (channelId, message) =>
  bot.sendMessage({
    to: channelId,
    message
  });

bot.on("message", (user, userID, channelID, message, event) => {
  logger.info(`Got message from ${userID} in channel ${channelID}!`);

  if (channelID != "457011209372303371") {
    logger.info("Not for the test channel");
    return;
  }

  const command = message.split(" ")[0];
  const gameName = message.replace(RegExp(`^${command} `), "");

  logger.info(`[${command}] with game ${gameName} from ${userID}`);

  if (command == "!i_play_test") {
    const gameDoc = db.doc(`/channels/${channelID}/games/${gameName}`);

    db.runTransaction(t => {
      return t.get(gameDoc).then(doc => {
        const oldPlayers = doc.data().players;
        if (oldPlayers.includes(userID)) {
          logger.info(
            `[${command}] player ${userID} already plays ${gameName}`
          );
          throw "Player already plays";
        }
        const newPlayers = [...oldPlayers, userID];
        t.update(gameDoc, { players: newPlayers });
      });
    })
      .then(() => {
        logger.info(`[${command}] players ${userID} now plays ${gameName}`);
        bot.sendMessage({
          to: channelID,
          message: `You are now playing ${gameName}`
        });
      })
      .catch(() => {
        bot.sendMessage({
          to: channelID,
          message: `<@${userID}> already play ${gameName}`
        });
      });
  }

  if (command == "!who_plays") {
    const gameDoc = db.doc(`/channels/${channelID}/games/${gameName}`);
    gameDoc
      .get()
      .then(docOrDefault([]))
      .then(game => game.players)
      .then(players => buildWhoPlaysMessage(players, gameName))
      .then(message => sendMessage(channelID, message));
  }
});
