const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");
const _ = require("lodash");

Then(/the bot lists {(.*)} commands/, function(expectedNumCommandsString) {
  const expectedNumCommands = parseInt(expectedNumCommandsString, 10);
  const { bot } = this.mocks;
  const calledWith = bot.sendMessage.lastArg;
  const actualResponseChannel = calledWith.to;
  const actualResponseMessage = calledWith.message;
  expect(actualResponseChannel).to.equal(this.given.channelId);

  for (let i = 1; i <= expectedNumCommands; i++) {
    expect(actualResponseMessage).to.include(`[${i}]`);
  }
  expect(actualResponseMessage).not.to.include(`[${expectedNumCommands + 1}]`);
});
