const _ = require("lodash");
const extractGuildId = event => {
  return _.get(event, "d.guild_id");
};

module.exports = { extractGuildId };
