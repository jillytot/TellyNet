const logger = require('winston');

/**
 * Setup logging with Winston
 */
logger.add(logger.transports.File, { filename: './logs/tellynet.log' });

module.exports = logger;
