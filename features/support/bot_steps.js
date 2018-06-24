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

Given(/a guild {(.*)}/, function(guildId) {
  this.setGiven(oldState => ({
    ...oldState,
    guildId
  }));
});

Then(/the bot responds with {(.*)}/, function(expectedMessage) {
  const { bot } = this.mocks;
  const calledWith = bot.sendMessage.lastArg;
  const actualResponseChannel = calledWith.to;
  const actualResponseMessage = calledWith.message;
  expect(actualResponseChannel).to.equal(this.given.channelId);
  expect(actualResponseMessage).to.include(expectedMessage);
});
