const Discord = require("discord.io");
const winston = require("winston");
const express = require("express");
const axios = require("axios");
const auth = process.env.NODE_ENV == "production" ? {} : require("./auth.json");

const logger = winston.createLogger({
  transports: [new winston.transports.Console({ colorize: true })]
});
logger.level = "debug";

const app = express();

app.get("/ping", (req, res) => res.send("Pong!"));

app.listen(process.env.PORT || 3000, () =>
  console.log("Running web server for... no reason?")
);

const pingUrl =
  process.env.NODE_ENV == "production"
    ? "https://discord-play-bot.herokuapp.com/ping"
    : "http://localhost:3000/ping";

setInterval(() => axios.get(pingUrl), 10000);

const bot = new Discord.Client({
  token: process.env.bot_token || auth.token,
  autorun: true
});

const channels = {};

const gamesByChannel = {};

const addPlayer = (game, playerName, channelID) => {
  if (!channels[channelID]) {
    logger.info(`Initializing the channel container: ${channelID}`);
    channels[channelID] = {};
  }
  const games = channels[channelID];
  if (!games[game]) {
    logger.info(`Initalizing the game: ${game}`);
    games[game] = [];
  }
  if (games[game].includes(playerName)) {
    logger.info(
      `Player ${playerName} was already playing ${game} so we didn't add them`
    );
    return games[game];
  }
  games[game] = [...games[game], playerName];
};

const getPlayerList = (game, channelId) => {
  return channels[channelId] ? channels[channelId][game] : [] || [];
};

const getAllGames = channelId =>
  channels[channelId] ? Object.keys(channels[channelId]) : [];

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
      const players = getPlayerList(game, channelID);
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
      addPlayer(game, userID, channelID);
      bot.sendMessage({
        to: channelID,
        message: `${user} now plays ${game}`
      });
      break;
    case "!games":
      const allGames = getAllGames(channelID);
      bot.sendMessage({
        to: channelID,
        message: allGames.join(", ")
      });
      break;
    case "!commands":
      bot.sendMessage({
        to: channelID,
        message: "!i_play, !who_plays, !games"
      });
  }
});
