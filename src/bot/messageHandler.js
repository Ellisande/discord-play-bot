const winston = require("winston");
const { extractGuildId } = require("../discordUtils");
const { allCommands } = require("../commands/all");

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});
logger.level = "debug";

const playBotId = "456628305911873536";
const botMentionMatcher = /<@456628305911873536> ?/;

const isTestChannel = channel => channel == "457011209372303371";
const isTestUser = user => user == "232704012070158336";

const handleMessage = ({
  user,
  userID,
  channelID,
  originalMessage,
  event,
  bot,
  db
}) => {
  const enableTestCommands = isTestChannel(channelID);
  const guildId = extractGuildId(event);

  if (userID == playBotId) {
    logger.debug("Message was from play-bot himself");
    return;
  }

  // if (!isTestChannel(channelID)) {
  //   logger.debug("Only test channel right now");
  //   return;
  // }

  const commands = allCommands.filter(
    i => i.test == false || enableTestCommands
  );

  if (!originalMessage.match(botMentionMatcher)) {
    logger.debug("Message was not a command");
    return;
  }

  const message = originalMessage.replace(botMentionMatcher, "");
  const matchingCommand = commands.find(currentCommand =>
    currentCommand.matches(message)
  );
  if (matchingCommand) {
    return matchingCommand.handle({
      db,
      user,
      userId: userID,
      channelId: channelID,
      guildId,
      message,
      bot,
      event,
      logger
    });
  }
  if (message.match(/^commands/i)) {
    bot.sendMessage({
      to: channelID,
      message:
        "Try asking me:\n" +
        commands
          .map((i, index) => `[${index + 1}]: <@${playBotId}> ${i.example}`)
          .join("\n")
    });
    return Promise.resolve();
  }
  return Promise.reject();
};

module.exports = { handleMessage };
