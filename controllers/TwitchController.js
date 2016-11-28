/* eslint new-cap: 0 */

const TwitchIRC = require('tmi.js');
const StreamParser = require('../src/parsers/StreamParser');

const config = require('../config/config');
const logger = require('winston');
const server = require('../src/server');

// Configurations stored using node-convict
const clientConfig = {
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

const client = new TwitchIRC.client(clientConfig.options);

const eventListenerMappings = {
  action: registerActionListener,
  message: registerMessageListener,
  ban: registerBanListener,
  chat: registerChatListener,
  cheer: registerCheerListener
};

/**
 * Setup a twitch connection and join the channels listed in the config
 */
function setupConnection(events) {
  client
    .connect()
    .then(() => {
      console.log('connected to twitch');
      // Register event listeners for the event names given
      if (events) {
        events.forEach(eventName => {
          eventListenerMappings[eventName]();
        });
      }
    })
    .catch(err => {
      logger.log('error', 'Twitch IRC client error: ', err);
    });
}

function registerActionListener() {
  client.on('action', (channel, userstate, message) => {
    return StreamParser.parseTwitchContent(userstate, message);
  });
}

function registerMessageListener() {
  client.on('message', (channel, userstate, message) => {

    if (server.cm.socketConnections.length) {
      console.log(message);
      server.cm.socketConnections[0].sendUTF(message);
    }

    return StreamParser.parseTwitchContent(userstate, message);
  });
}

function registerBanListener() {
  /* client.on('ban', (channel, username, reason) => {
    //@TODO
  }); */
}

function registerChatListener() {
  /* client.on('chat', (channel, userstate, message) => {
    //@TODO
  }); */
}

function registerCheerListener() {
  /* client.on('cheer', (channel, userstate, message) => {
    //@TODO
  }); */
}

module.exports.setupConnection = setupConnection;
