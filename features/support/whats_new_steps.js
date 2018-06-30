const { Given, When, Then } = require("cucumber");

When(/the user says (what's|what is|is anything) (new.*)/, function(
  command,
  remaining
) {
  const { bot, user, event } = this.mocks;
  const {
    whatsNewCommand: commandClass
  } = require(`../../src/commands/whatsNew`);

  return commandClass.handle({
    bot,
    user,
    event,
    userId: this.given.userId,
    channelId: this.given.channelId,
    message: `${command} ${remaining}`
  });
});
