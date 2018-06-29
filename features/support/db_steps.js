const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");
const sinon = require("sinon");

Given(/user {(.*)} plays {(.*)}/, function(userId, gameName) {
  // db.doc.get.then.data is called [ userId ] is returned
  this.updateDbBuilder(builder =>
    builder.updateState(oldState => ({ ...oldState, players: [userId] }))
  );
});

Then(/the guild {(.*)} exists/, function(guildId) {
  const { db } = this.mocks;
  const setPath = db.doc.lastArg;
  expect(setPath).to.include(guildId);
});

Then(/the game {(.*)} exists/, function(gameName) {
  const { db } = this.mocks;
  const setPath = db.doc.lastArg;
  expect(setPath).to.include(gameName);
});

Then(/the user {(.*)} is added to the players list/, function(userId) {
  const { db } = this.mocks;
  const actualUpdate = db.setMock.lastArg;
  const actualPlayers = actualUpdate.players;
  expect(actualPlayers).to.include(userId);
});
