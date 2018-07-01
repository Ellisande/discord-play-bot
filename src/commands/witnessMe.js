const { Command } = require("./command");
const { update } = require("../firestoreUtils");
const _ = require("lodash");

const ALREADY_WATCHED = Symbol("ALREADY_WATCHED");

const madMaxMatcher = /witness me/gi;
const harryPotterMatcher = /I solemnly swear that I am up to no good/gi;

const madMax = Symbol("MAD_MAX");
const harryPotter = Symbol("HARRY_POTTER");

const themeType = message =>
  message.match(madMaxMatcher) ? madMax : harryPotter;

const buildResponse = (userId, originalMessage) => {
  return themeType(originalMessage) === madMax
    ? `<@${userId}> we ride eternal - shiny and chrome!`
    : `<@${userId}> this little beauty's taught us more than all the teachers in this school`;
};

const witnessMeCommand = new Command({
  name: "Witness Me",
  command: /(witness me|I solemnly swear that I am up to no good)/gi,
  example: "witness me",
  test: false,
  handler: ({ bot, channelId, userId, db, guildId, originalMessage }) => {
    const updateWatched = update(db)(`guilds/${guildId}`);
    const updatePromise = updateWatched((oldWatched = {}) => {
      const oldWatchedUsers = _.get(oldWatched, "watched_users", []);
      if (oldWatchedUsers.includes(userId)) {
        throw ALREADY_WATCHED;
      }
      return {
        ...oldWatched,
        watched_users: [...oldWatchedUsers, userId]
      };
    });
    return updatePromise
      .then(() => {
        bot.sendMessage({
          to: channelId,
          message: buildResponse(userId, originalMessage)
        });
      })
      .catch(error => {
        if (error === ALREADY_WATCHED) {
          bot.sendMessage({
            to: channelId,
            message: `<@${userId}> I am watching you. If you want to stop tell me \`we are not things\` or \`mischief managed\``
          });
          return;
        }
        throw error;
      });
  }
});

module.exports = { witnessMeCommand, ALREADY_WATCHED };
