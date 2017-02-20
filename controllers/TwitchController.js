/* eslint new-cap: 0 */

const TwitchIRC = require('tmi.js');
const StreamParser = require('../src/parsers/StreamParser');

const config = require('../config/config');
const logger = require('winston');
const server = require('../src/server');
const _ = require('lodash');

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
  cheer: registerCheerListener,
  ban: registerBanListener,
  chat: registerChatListener
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

//@TODO: move this to the ConnectionManager
function getSocketConnectionsByChannel(channel) {
  return _.filter(server.cm.socketConnections, {channel: channel});
}

function sendSocketMessage(type, channel, userstate, message) {

  if (server.cm.socketConnections.length) {

    let socketConnections = getSocketConnectionsByChannel(channel);
    if (socketConnections.length !== 0) {

      console.log(`Sending message: ${message} over channel: ${channel} `);
      let serverMessage = StreamParser.parseTwitchContent(type, channel, userstate, message);

      // Send the message to each socket connection in the channel
      socketConnections.forEach((sc) => {
        sc.connection.sendUTF(JSON.stringify(serverMessage));
      });
    }
  }
}

function registerActionListener() {
  client.on('action', (channel, userstate, message) => {
    sendSocketMessage('action', channel, userstate, message);
  });
}

function registerMessageListener() {
  client.on('message', (channel, userstate, message) => {
    sendSocketMessage('message', channel, userstate, message);
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
  client.on('cheer', (channel, userstate, message) => {
    sendSocketMessage('cheer', channel, userstate, message);
  });
}

module.exports.setupConnection = setupConnection;
