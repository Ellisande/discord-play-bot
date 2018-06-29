const testGuildId = "232704328509554688";

const createTestEvent = overrides => ({
  d: {
    ...overrides,
    guild_id: testGuildId
  }
});

module.exports = { createTestEvent };
