const { Command } = require("./command");

const pingCommand = new Command({
  command: /^ping$/i,
  name: "Ping",
  test: true,
  example: "ping",
  handler: ({ bot, channelId }) => {
    bot.sendMessage({
      to: channelId,
      message: "Pong"
    });
  }
});

module.exports = { pingCommand };
