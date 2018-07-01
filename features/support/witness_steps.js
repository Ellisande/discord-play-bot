const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");

Given(/a watched user {(.*)}/, function(userId) {
  this.updateMockDbState(oldState => ({
    ...oldState,
    watched_users: [...(oldState.watched_users || []), userId]
  }));
  this.setGiven(oldState => ({ ...oldState, userId }));
});

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

Then(/the game is now played by user {(.*)}/, function(userId) {
  const { db } = this.mocks;
  const newState = db.lastStateUpdate;
  const newPlayers = newState.players;
  expect(newPlayers).to.include(userId);
});

Then(/the game is not played by user {(.*)}/, function(userId) {
  const { db } = this.mocks;
  const newState = db.lastStateUpdate;
  expect(newState).not.to.exist;
});

Then(/the game {(.*)} is updated/, function(gameName) {
  const { db } = this.mocks;
  const updatePath = db.lastUpdatedPath;
  expect(updatePath).to.include(gameName);
});

Then(/the game {(.*)} is not updated/, function(gameName) {
  const { db } = this.mocks;
  const updatePath = db.lastUpdatedPath;
  expect(updatePath).not.to.include(gameName);
});

Then(/the user {(.*)} is no longer on the watched players list/, function(
  userId
) {
  const { db } = this.mocks;
  const newState = db.lastStateUpdate;
  const newPlayers = newState.watched_users;
  expect(newPlayers).not.to.include(userId);
});
