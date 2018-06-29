const { Given, When, Then } = require("cucumber");

Given(/no one plays any games/, function() {
  this.updateDbBuilder(builder => builder.updateState(() => ({ players: [] })));
});

When(/the user says (who is|does anyone|who) (plays?|playing) (.*)/, function(
  prefix,
  command,
  gameName
) {
  const { bot, user, event } = this.mocks;
  const {
    whoPlaysCommand: commandClass
  } = require(`../../src/commands/whoPlays`);

  const db = this.createDbMock();

  return commandClass.handle({
    bot,
    user,
    event,
    db,
    userId: this.given.userId,
    channelId: this.given.channelId,
    guildId: this.given.guildId,
    message: `${prefix} ${command} ${gameName}`
  });
});
