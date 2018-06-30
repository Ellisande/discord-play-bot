const winston = require("winston");
const { extractGuildId } = require("../discordUtils");
const { allCommands } = require("../commands/all");
const { isTestChannel, isTestUser } = require("./testUtils");

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
});
logger.level = "debug";

const playBotId = "456628305911873536";
const botMentionMatcher = /<@456628305911873536> ?/;

const handleMessage = ({
  user,
  userId,
  channelId,
  originalMessage,
  event,
  bot,
  db
}) => {
  const enableTestCommands = isTestChannel(channelId);
  const guildId = extractGuildId(event);

  if (userId == playBotId) {
    logger.debug("Message was from play-bot himself");
    return;
  }

  // if (!isTestChannel(channelId)) {
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
      userId: userId,
      channelId: channelId,
      guildId,
      message,
      bot,
      event,
      logger
    });
  }
  return Promise.resolve();
};

module.exports = { handleMessage };
