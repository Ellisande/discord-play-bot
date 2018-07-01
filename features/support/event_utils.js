const testGuildId = "232704328509554688";

const createTestEvent = overrides => ({
  d: {
    guild_id: testGuildId,
    ...overrides
  }
});

module.exports = { createTestEvent };
