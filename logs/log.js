const logger = require('winston');

/**
 * Setup logging with Winston
 */
logger.add(logger.transports.File, {
  filename: './logs/tellynet.log',
  handleExceptions: true,
  humanReadableUnhandledException: true
});

module.exports = logger;
