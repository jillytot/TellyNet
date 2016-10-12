
const TwitchIRC = require('tmi.js');
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

function setupConnection(channel) {

  client
    .connect()
    .then(() => {
      return client.join(channel)
  })
    .then(() => {

      client.on('chat', (channel, user, message, self) => {
        //@TODO: Start parsing here
      });
    })
    .catch((err) => {
      logger.log('error', 'Twitch IRC client error: ', err);
    });

}

module.exports.setupConnection = setupConnection;
