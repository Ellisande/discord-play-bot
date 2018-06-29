const { Given, When, Then } = require("cucumber");

Given(/game {(.*)} is being played/, function(gameName) {
  const mockGames = [
    {
      id: gameName,
      players: [1]
    }
  ];
  this.updateMockDbCollection(old => [...old, ...mockGames]);
});
