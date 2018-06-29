const { Given, When, Then } = require("cucumber");

When(/the user says I play {(.*)}/i, function(gameName) {
  const { bot, user, event } = this.mocks;
  const { iPlayCommand: commandClass } = require(`../../src/commands/iPlay`);

  const db = this.createDbMock();

  return commandClass.handle({
    bot,
    user,
    event,
    db,
    userId: this.given.userId,
    channelId: this.given.channelId,
    guildId: this.given.guildId,
    message: `I play ${gameName}`
  });
});
