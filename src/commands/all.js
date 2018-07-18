const { whoPlaysCommand } = require("./whoPlays");
const { iPlayCommand } = require("./iPlay");
const { gamesCommand } = require("./games");
const { whatsNewCommand } = require("./whatsNew");
const { witnessMeCommand } = require("./witnessMe");
const { helpCommand } = require("./help");
const { pingCommand } = require("./ping");
const { ignoreMeCommand } = require("./ignoreMe");
const { quitCommand } = require("./quit");

const allCommands = [
  whoPlaysCommand,
  iPlayCommand,
  gamesCommand,
  whatsNewCommand,
  witnessMeCommand,
  helpCommand,
  pingCommand,
  ignoreMeCommand,
  quitCommand
];

module.exports = { allCommands };
