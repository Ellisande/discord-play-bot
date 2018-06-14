var Discord = require("discord.io");
var winston = require("winston");
var auth = require("./auth.json");

var logger = winston.createLogger({
  transports: [new winston.transports.Console({ colorize: true })]
});
logger.level = "debug";

var bot = new Discord.Client({
  token: process.env.bot_token || auth.token,
  autorun: true
});

const channels = {};

const games = {};

const addPlayer = (game, playerName) => {
  if (!games[game]) {
    logger.info("Initalizing the game: " + game);
    games[game] = [];
  }
  if (games[game].includes(playerName)) {
    logger.info(
      `Player ${playerName} was always playing ${game} so we didn't add them`
    );
    return games[game];
  }
  games[game] = [...games[game], playerName];
};

const getPlayerList = game => {
  return games[game] || [];
};

const getAllGames = () => Object.keys(games);

bot.on("ready", event => {
  logger.info("Connected");
  logger.info("Logged in as");
  logger.info(`${bot.username} - (${bot.id})`);
});

bot.on("message", (user, userID, channelID, message, event) => {
  logger.info("Got message!");
  logger.info(message);
  if (!message.match(/^!/)) {
    logger.info("Message didn't match /^!/");
    return;
  }

  const command = message.split(" ")[0];
  logger.info(`Command received: ${command}`);
  const game = message.replace(RegExp(`^${command} `), "").toLowerCase();

  switch (command) {
    case "!ping":
      bot.sendMessage({
        to: channelID,
        message: "Pong!"
      });
      logger.info("I pinged!");
      break;
    case "!who_plays":
      const players = getPlayerList(game);
      const playerMentions = players.map(userId => `<@${userId}>`).join(", ");
      const message =
        players.length > 0
          ? `${game} players: ${playerMentions}`
          : `No on plays ${game} or they just don't want to admit it`;
      bot.sendMessage({
        to: channelID,
        message: message
      });
      break;
    case "!i_play":
      addPlayer(game, userID);
      bot.sendMessage({
        to: channelID,
        message: `${user} now plays ${game}`
      });
      break;
    case "!games":
      const allGames = getAllGames();
      bot.sendMessage({
        to: channelID,
        message: allGames.join(", ")
      });
      break;
  }
});
