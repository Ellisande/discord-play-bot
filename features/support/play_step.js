const { Given, When, Then } = require("cucumber");

When(/the user says !i_play {(.*)}/, function(gameName) {
  const { bot, user, db, event } = this.mocks;
  const { iPlayCommand: commandClass } = require(`../../src/commands/iPlay`);
  return commandClass.handle({
    bot,
    user,
    event,
    db,
    userId: this.given.userId,
    channelId: this.given.channelId,
    guildId: this.given.guildId,
    message: `!i_play ${gameName}`
  });
});
