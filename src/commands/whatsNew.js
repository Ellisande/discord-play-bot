const { Command } = require("./command");

const newThings = [
  `New command <@456628305911873536> \`witness me\` will tell me to add you as a player to any game that shows up as your discord status`,
  `I have a much more natural interface now! Just metion me and ask about what you are looking for. Try <@456628305911873536> \`commands\` to learn more!`,
  `Thanks for asking! My memory is much better now, I won't forget the games you play anymore!`,
  `You can now tell me what games you play with !i_play {game}`,
  `Looking for other players? Try !who_plays {game} to see who's playing!`
];

const whatsNewCommand = new Command({
  name: "What's new",
  command: /(what'?s|what is|is anything) new\??/gi,
  example: "whats new?",
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
