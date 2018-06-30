const { Command } = require("./command");
const { botId } = require("../bot/info");
const { isTestChannel, isTestUser } = require("../bot/testUtils");

const helpCommand = new Command({
  command: /^(help|commands)$/i,
  name: "Help",
  test: false,
  example: "help",
  handler: ({ bot, userId, channelId }) => {
    const { allCommands } = require("./all");
    const enableTestCommands = isTestChannel(channelId) || isTestUser(userId);
    const availableCommands = allCommands.filter(
      i => !i.test || enableTestCommands
    );
    return bot.sendMessage({
      to: channelId,
      message:
        "Try asking me:\n" +
        availableCommands
          .map((i, index) => `[${index + 1}]: <@${botId}> ${i.example}`)
          .join("\n")
    });
  }
});

module.exports = { helpCommand };
