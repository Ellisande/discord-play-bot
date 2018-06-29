const { whoPlaysCommand } = require("./whoPlays");
const { iPlayCommand } = require("./iPlay");
const { gamesCommand } = require("./games");
const { whatsNewCommand } = require("./whatsNew");
const { witnessMeCommand } = require("./witnessMe");

const allCommands = [
  whoPlaysCommand,
  iPlayCommand,
  gamesCommand,
  whatsNewCommand,
  witnessMeCommand
];

module.exports = { allCommands };
