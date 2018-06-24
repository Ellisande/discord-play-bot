const { Given, When, Then } = require("cucumber");

When(/the user says (who is|does anyone|who) (plays?|playing) (.*)/, function(
  prefix,
  command,
  gameName
) {
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
    guildId: this.given.guildId,
    message: `${prefix} ${command} ${gameName}`
  });
});
