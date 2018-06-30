const { Command } = require("./command");
const { update } = require("../firestoreUtils");
const _ = require("lodash");

const ALREADY_WATCHED = Symbol("ALREADY_WATCHED");

const witnessMeCommand = new Command({
  name: "Witness Me",
  command: /witness me/gi,
  example: "witness me",
  test: false,
  handler: ({ bot, channelId, userId, db, guildId }) => {
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
          message: `<@${userId}> we ride eternal! Shiny and chrome!`
        });
      })
      .catch(error => {
        if (error === ALREADY_WATCHED) {
          bot.sendMessage({
            to: channelId,
            message: `<@${userId}> you are being witnessed.`
          });
          return;
        }
        throw error;
      });
  }
});

module.exports = { witnessMeCommand, ALREADY_WATCHED };
