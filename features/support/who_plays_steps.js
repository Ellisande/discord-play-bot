const { Given, When, Then } = require("cucumber");

When(/the user says !who_plays {(.*)}/, function(gameName) {
  const { bot, user, db, event } = this.mocks;
  const {
    whoPlaysCommand: commandClass
  } = require(`../../src/commands/whoPlays`);
  return commandClass.handle({
    bot,
    user,
    event,
    db,
    userId: this.given.userId,
    channelId: this.given.channelId,
    message: `!who_plays ${gameName}`
  });
});
