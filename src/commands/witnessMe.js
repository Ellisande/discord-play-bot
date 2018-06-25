const { Command } = require("./command");
const { update } = require("../firestoreUtils");

const ALREADY_WATCHED = Symbol("ALREAD_WATCHED");

const witnessMeCommand = new Command({
  name: "Witness Me",
  command: /witness me/gi,
  example: "witness me",
  test: false,
  handler: ({ bot, channelId, userId, db, guildId }) => {
    const watchedUsers = db.doc(`guilds/${guildId}`);
    const updateWatched = update(db)(watchedUsers);
    const updatePromise = updateWatched(
      (
        oldWatched = {
          watched_users: []
        }
      ) => {
        if (oldWatched.watched_users.includes(userId)) {
          throw ALREADY_WATCHED;
        }
        return {
          ...oldWatched,
          watched_users: [...oldWatched.watched_users, userId]
        };
      }
    );
    return updatePromise.then(() => {
      bot.sendMessage({
        to: channelId,
        message: `<@${userId}> we ride eternal! Shiny and chrome!`
      });
    });
  }
});

module.exports = { witnessMeCommand, ALREADY_WATCHED };
