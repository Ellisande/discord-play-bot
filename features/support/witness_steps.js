const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");

When(/the user says witness me/, function() {
  const { bot, user, event } = this.mocks;
  const {
    witnessMeCommand: commandClass
  } = require(`../../src/commands/witnessMe`);

  const db = this.createDbMock();

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

Then(/the user {(.*)} is added to the watched players list/, function(userId) {
  const { db } = this.mocks;
  const newState = db.lastStateUpdate;
  const newUserList = newState.watched_users;
  expect(newUserList).to.include(userId);
});
