const { Command } = require("./command");

const newThings = [
  `Thanks for asking! My memory is much better now, I won't forget the games you play anymore!`,
  `You can now tell me what games you play with !i_play {game}`,
  `Looking for other players? Try !who_plays {game} to see who's playing!`
];

const whatsNewCommand = new Command({
  command: "whats_new",
  handler: ({ message, bot, channelId, logger }) => {
    let numNewThings;
    try {
      numNewThings = parseInt(message, 10);
    } catch (e) {}
    numNewThings = isNaN(numNewThings) ? 1 : numNewThings;
    logger.debug(
      `Getting the news ${numNewThings}, ${newThings
        .slice(0, numNewThings + 1)
        .join("\n")}`
    );
    const thingsToList = newThings.slice(0, numNewThings);
    const newThingsMessage = thingsToList
      .map((thing, index) => `[${index + 1}]: ${thing}`)
      .join("\n\n");
    bot.sendMessage({
      to: channelId,
      message: newThingsMessage
    });
  }
});

module.exports = { whatsNewCommand };
