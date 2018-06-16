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

Then(/the bot responds with {(.*)}/, function(expectedMessage) {
  const { bot } = this.mocks;
  const calledWith = bot.sendMessage.lastArg;
  //   console.log("Send message was called ", bot.sendMessage.callCount);
  expect(calledWith).to.deep.equal({
    to: this.given.channelId,
    message: expectedMessage
  });
});
