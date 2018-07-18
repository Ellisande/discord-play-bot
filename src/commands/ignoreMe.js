const { Command } = require("./command");
const { removeWatchedUser } = require("../store/store");

const madMaxMatcher = /we are not things/gi;
const harryPotterMatcher = /mischief managed/gi;

const madMax = Symbol("MAD_MAX");
const harryPotter = Symbol("HARRY_POTTER");

const themeType = message =>
  message.match(madMaxMatcher) ? madMax : harryPotter;

const buildResponse = (userId, originalMessage) => {
  return themeType(originalMessage) === madMax
    ? `<@${userId}> I thought you weren't insane anymore`
    : `<@${userId}> things we lose have a way of coming back to us in the end, if not always in the way we expect`;
};

const ignoreMeCommand = new Command({
  command: /(mischief managed)/,
  name: "Ignore Me",
  //   test: true,
  example: "michief managed",
  handler: ({
    bot,
    userId,
    channelId,
    originalMessage,
    guildId,
    db,
    logger
  }) => {
    const removePromise = removeWatchedUser(db, guildId, userId);
    logger.debug(`Attempting to remove ${userId} from ${guildId}`);
    return removePromise.then(() => {
      bot.sendMessage({
        to: channelId,
        message: buildResponse(userId, originalMessage)
      });
    });
  }
});

module.exports = { ignoreMeCommand };
