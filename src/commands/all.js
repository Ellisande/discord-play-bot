const { whoPlaysCommand } = require("./whoPlays");
const { iPlayCommand } = require("./iPlay");
const { gamesCommand } = require("./games");
const { whatsNewCommand } = require("./whatsNew");
const { witnessMeCommand } = require("./witnessMe");
const { helpCommand } = require("./help");
const { pingCommand } = require("./ping");

const allCommands = [
  whoPlaysCommand,
  iPlayCommand,
  gamesCommand,
  whatsNewCommand,
  witnessMeCommand,
  helpCommand,
  pingCommand
];

module.exports = { allCommands };
