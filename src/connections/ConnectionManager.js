/* eslint new-cap: 0 */
/* eslint padded-blocks: 0 */
/* eslint brace-style: 0 */
const WebSocketServer = require('websocket').server;
const logger = require('winston');
const util = require('util');
const _ = require('lodash');

/**
 * ConnectionManager - Web Sockets client manager.
 *
 * @param server
 * @constructor
 */
function ConnectionManager(server) {

  this.Server = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  });

  this.socketConnections = [];
  this.setupListeners();

}

ConnectionManager.prototype.setupListeners = function setupListeners() {
  this.Server.on('request', request => {

    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      logger.log('info', (new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }

    const connection = request.accept(undefined, request.origin);
    this.socketConnections.push({connection: connection, channel: undefined});

    logger.log('info', new Date() + ' Connection accepted.');
    connection.on('message', message => {

      this.processMessage(connection, message);

      if (message.type === 'utf8') {
        connection.sendUTF(message.utf8Data);
      }
      else if (message.type === 'binary') {
        connection.sendBytes(message.binaryData);
      }
    });

    connection.on('close', () => {
      _.remove(this.socketConnections, (sc) => {
          return sc.connection === connection;
      });
      console.log(this.socketConnections.length);
      console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.');
      logger.log('info', (new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
  });

  ConnectionManager.prototype.shutDown = function closeConnections() {
    "use strict";
    this.socketConnections = [];
    this.Server.shutDown();
    console.log(this.socketConnections.length);
    console.log(new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.');
    logger.log('info', (new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  }

};

/**
 * @TODO error handling/logging
 * @param message
 * @param connection
 */
ConnectionManager.prototype.processMessage = function processMessage(connection, message) {
  let msg =  message.utf8Data.split(' ');
  console.log(msg);
  if (msg[0] === 'join') {
    this.processChannelJoin(connection, msg[1]);
  }
};

ConnectionManager.prototype.processChannelJoin = function processChannel(connection, channel) {
    let socketConnection = _.find(this.socketConnections, {'connection': connection});
    socketConnection.channel = channel;
};

function originIsAllowed(origin) {
  // @TODO: Set the origin of the web socket and verify here
  // return config.get('allowedOrigins').indexOf(origin) !== -1;
  //return origin !== undefined;
  return true;
}



module.exports = ConnectionManager;
