
const TwitchIRC = require('tmi.js');
const config = require('../config/config');

// Configurations stored using node-convict
const options = {
  options: {
    debug: config.get('twitch').debug,
    clientId: config.get('twitch').clientId,
    connection: {
      reconnect: true
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
      //@TODO: put logger error here
    });

}

module.exports.setupConnection = setupConnection;
