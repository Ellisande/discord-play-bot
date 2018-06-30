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
  return handleMessage({
    user: this.given.user,
    userId: this.given.userId,
    channelId: this.given.channelId,
    originalMessage: fullMessage,
    event: this.given.event,
    bot: this.mocks.bot,
    db: this.createDbMock()
  });
});

Then(/the bot responds with {(.*)}/, function(expectedMessage) {
  const { bot } = this.mocks;
  const calledWith = bot.sendMessage.lastArg;
  const actualResponseChannel = calledWith.to;
  const actualResponseMessage = calledWith.message;
  expect(actualResponseChannel).to.equal(this.given.channelId);
  expect(actualResponseMessage).to.include(expectedMessage);
});
