const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");

When(/the user says witness me/, function() {
  const { bot, user, db, event } = this.mocks;
  const {
    witnessMeCommand: commandClass
  } = require(`../../src/commands/witnessMe`);

  return commandClass.handle({
    bot,
    user,
    event,
    db,
    userId: this.given.userId,
    channelId: this.given.channelId,
    guildId: this.given.guildId,
    message: `witness me`
  });
});

Then(/the watched users for {(.*)} contains {(.*)}/, function(guild, user) {
  expect(this.when.guild[guild]).to.include(user);
});
