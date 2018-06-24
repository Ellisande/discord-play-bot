const { Given, When, Then } = require("cucumber");
const { expect } = require("chai");
const sinon = require("sinon");

Given(/user {(.*)} plays {(.*)}/, function(userId, gameName) {
  // db.doc.get.then.data is called [ userId ] is returned
  const {
    db: { docRef }
  } = this.mocks;
  docRef.data = sinon.fake.returns({ players: [userId] });
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

Then(/the guild {(.*)} exists/, function(guildId) {
  const {
    db: { transactionSet, doc, docRef }
  } = this.mocks;
  const lastDoc = doc.lastArg;
  expect(lastDoc).to.include(guildId);

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
