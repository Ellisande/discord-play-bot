const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");
const sinon = require("sinon");

Given(/user {(.*)} plays {(.*)}/, function(userId, gameName) {
  this.updateMockDbState(oldState => ({ ...oldState, players: [userId] }));
});

Then(/the guild {(.*)} exists/, function(guildId) {
  const { db } = this.mocks;
  const setPath = db.lastUpdatedPath;
  expect(setPath).to.include(guildId);
});

Then(/the game {(.*)} exists/, function(gameName) {
  const { db } = this.mocks;
  const setPath = db.lastUpdatedPath;
  expect(setPath).to.include(gameName);
});

Then(/the user {(.*)} is added to the players list/, function(userId) {
  const { db } = this.mocks;
  const actualUpdate = db.lastStateUpdate;
  const actualPlayers = actualUpdate.players;
  expect(actualPlayers).to.include(userId);
});
