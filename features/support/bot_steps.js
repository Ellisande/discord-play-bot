const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");
const sinon = require("sinon");

Given(/a channel {(.*)}/, function(channelId) {
  this.setGiven(oldState => ({
    ...oldState,
    channelId
  }));
});

Given(/a user {(.*)}/, function(userId) {
  this.setGiven(oldState => ({
    ...oldState,
    userId
  }));
});

Given(/user {(.*)} plays {(.*)}/, function(userId, gameName) {
  // db.doc.get.then.data is called [ userId ] is returned
  const {
    db: { docRef }
  } = this.mocks;
  docRef.data = sinon.fake.returns({ players: [userId] });
});

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
    message: `!i_play ${gameName}`
  });
});

When(/the user says !who_plays {(.*)}/, function(gameName) {
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
    message: `!who_plays ${gameName}`
  });
});

Then(/the channel {(.*)} exists/, function(channelName) {
  const {
    db: { transactionSet, doc, docRef }
  } = this.mocks;
  const lastDoc = doc.lastArg;
  expect(lastDoc).to.include(channelName);

  const lastSet = transactionSet.callCount;
  return "pending";
});

Then(/the game {(.*)} exists/, function(gameName) {
  const {
    db: { transactionGet, doc, docRef }
  } = this.mocks;
  const lastDoc = doc.lastArg;
  expect(lastDoc).to.include(channelName);

  const lastGet = transactionGet.lastArg;
  expect(lastGet).to.equal(docRef);
});

Then(/the user {(.*)} exists in the {(.*)} player list/, function(
  userId,
  gameName
) {
  //   return "pending";
});

Then(/the bot responds with {(.*)}/, function(expectedMessage) {
  const { bot } = this.mocks;
  const calledWith = bot.sendMessage.lastArg;
  console.log("Send message was called ", bot.sendMessage.callCount);
  expect(calledWith).to.deep.equal({
    to: this.given.channelId,
    message: expectedMessage
  });
});
