/* eslint new-cap: 0 */
/* eslint padded-blocks: 0 */
/* eslint brace-style: 0 */
const logger = require('winston');
const net = require('net');
const JsonSocket = require('json-socket');
const config = require('../../config/config');

/**
 * ConnectionManager - Web Sockets client manager.
 *
 * @constructor
 */
function ConnectionManager() {

  this.socketConnections = [];

  // Create a TCP socket listener
  this.Server = net.Server(connectionListeners.bind(this));
  this.Server.listen(8000);

  logger.log('info', 'Unity socket TCP connection waiting at: ' + config.get('ip') + ':8000');
}

function connectionListeners(socket) {

  socket = new JsonSocket(socket);
  this.socketConnections.push(socket);
  logger.log('info', new Date() + ' Connection accepted: ' + socket.remoteAddress + ":" + socket.remotePort);

  socket.on('data', function (msg_sent) {
      //console.log(msg_sent);
    }.bind(this)
  );

  socket.on('end', function () {
      const i = this.socketConnections.indexOf(socket);
      this.socketConnections.splice(i, 1);
      logger.log('info', (new Date()) + ' Peer ' + socket.remoteAddress + ' disconnected.');
    }.bind(this)
  );
}

module.exports = ConnectionManager;
