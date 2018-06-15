const winston = require("winston");

const { combine, json, printf } = winston.format;

const logLevel = process.env.LOG_LEVEL || "debug";

const commandFormat = winston.format((info, opts) => {
  return {
    ...info,
    message: `[${opts.command}] ${info.message}`,
    command: opts.command
  };
});

class Command {
  constructor({ command, handler, test }) {
    this.test = test;
    this.commandString = !test ? command : `${command}_test`;
    this.handler = handler;
    this.commandMatcher = RegExp(`^!?${this.commandString} ?`);
    this.logger = winston.createLogger({
      format: combine(commandFormat({ command: this.commandString }), json()),
      transports: [new winston.transports.Console()]
    });
    this.logger.level = logLevel;
  }

  handle({ bot, user, userId, channelId, message, event, db }) {
    const { logger } = this;
    const remaining = message.replace(this.commandMatcher, "");
    logger.debug("executing command");
    const handlerResult = this.handler({
      bot,
      user,
      userId,
      channelId,
      message: remaining,
      event,
      db,
      logger
    });
    if (handlerResult instanceof Promise) {
      handlerResult.finally(() => logger.debug("Finished command"));
    } else {
      logger.debug("finished command");
    }
    return handlerResult;
  }

  matches(command) {
    this.logger.debug(
      `checking if user command ${command} matches our command ${this.command}`
    );
    const matched = command.match(this.commandMatcher);
    matched
      ? this.logger.debug("successfully matched")
      : this.logger.debug("not matched");
    return matched;
  }

  get command() {
    return this.commandString;
  }
}

module.exports = { Command };
