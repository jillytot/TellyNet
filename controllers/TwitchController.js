
const TwitchIRC = require('tmi.js');
const StreamParser = require('../src/parsers/StreamParser');
const config = require('../config/config');
const logger = require('winston');

// Configurations stored using node-convict
const options = {
  options: {
    debug: config.get('twitch').debug,
    clientId: config.get('twitch').clientId,
    connection: {
      reconnect: config.get('twitch').reconnect
    },
    identity: {
      username: config.get('twitch').username,
      password: config.get('twitch').password
    },
    channels: config.get('twitch').channels
  }
};

const client = new TwitchIRC.client(options);

/**
 *
 * Setup a twitch connection on a given channel
 * @param channel
 */
function setupConnection(channel) {

  client
    .connect()
    .then(() => {
      return client.join(channel)
  })
    .then(() => {

      // Listen for chat events on the specified Twitch Channel
      client.on('chat', (channel, user, message) => {

        return StreamParser.parseTwitchContent(user, message);
      });

    })
    .catch((err) => {
      logger.log('error', 'Twitch IRC client error: ', err);
    });

}

module.exports.setupConnection = setupConnection;
