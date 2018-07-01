const { Given, When, Then } = require("cucumber");
const chaiAsPromised = require("chai-as-promised");
const chai = require("chai");
const { createTestEvent } = require("./event_utils");

chai.use(chaiAsPromised);
const { expect } = chai;

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

Given(/a test user/, function() {
  const { testUserId } = require("../../src/bot/testUtils");
  this.setGiven(oldState => ({
    ...oldState,
    userId: testUserId
  }));
});

Given(/a guild {(.*)}/, function(guildId) {
  this.setGiven(oldState => ({
    ...oldState,
    guildId
  }));
});

When(/the user says to the bot {(.*)}/, function(userMessage) {
  const { handleMessage } = require("../../src/bot/messageHandler");
  const { botId } = require("../../src/bot/info");
  const fullMessage = `<@${botId}> ${userMessage}`;
  const event = createTestEvent({
    guild_id: this.given.guildId
  });
  return handleMessage({
    user: this.given.user,
    userId: this.given.userId,
    channelId: this.given.channelId,
    originalMessage: fullMessage,
    event,
    bot: this.mocks.bot,
    db: this.createDbMock()
  });
});

When(/the user's presence changes to playing {(.*)}/, function(gameName) {
  const { handlePresence } = require("../../src/bot/presenceHandler");
  const game = {
    name: gameName
  };
  const resultPromise = handlePresence({
    user: this.given.user,
    userId: this.given.userId,
    status: this.given.status,
    game,
    event: this.given.event,
    db: this.createDbMock()
  });
  this.setWhen(oldState => ({ ...oldState, result: resultPromise }));
  return resultPromise;
});

When(/the user's presence changes to streaming {(.*)}/, function(gameName) {
  const { handlePresence } = require("../../src/bot/presenceHandler");
  const game = {
    name: gameName,
    url: "https://ellisande.com"
  };
  const resultPromise = handlePresence({
    user: this.given.user,
    userId: this.given.userId,
    status: this.given.status,
    game,
    event: this.given.event,
    db: this.createDbMock()
  });
  this.setWhen(oldState => ({ ...oldState, result: resultPromise }));
  return resultPromise;
});

When(/the user's presence changes to playing an unknown game/, function() {
  const { handlePresence } = require("../../src/bot/presenceHandler");
  const game = {
    name: undefined
  };
  const resultPromise = handlePresence({
    user: this.given.user,
    userId: this.given.userId,
    status: this.given.status,
    game,
    event: this.given.event,
    db: this.createDbMock()
  });
  this.setWhen(oldState => ({ ...oldState, result: resultPromise }));
  return resultPromise;
});

Then(/the bot responds with {(.*)}/, function(expectedMessage) {
  const { bot } = this.mocks;
  const calledWith = bot.sendMessage.lastArg;
  const actualResponseChannel = calledWith.to;
  const actualResponseMessage = calledWith.message;
  expect(actualResponseChannel).to.equal(this.given.channelId);
  expect(actualResponseMessage).to.include(expectedMessage);
});

Then(/no error occurs/, function() {
  expect(this.when.result).to.be.fulfilled;
});
