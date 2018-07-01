const { whoPlaysCommand } = require("./whoPlays");
const { iPlayCommand } = require("./iPlay");
const { gamesCommand } = require("./games");
const { whatsNewCommand } = require("./whatsNew");
const { witnessMeCommand } = require("./witnessMe");
const { helpCommand } = require("./help");
const { pingCommand } = require("./ping");
const { ignoreMeCommand } = require("./ignoreMe");

const allCommands = [
  whoPlaysCommand,
  iPlayCommand,
  gamesCommand,
  whatsNewCommand,
  witnessMeCommand,
  helpCommand,
  pingCommand,
  ignoreMeCommand
];

module.exports = { allCommands };
