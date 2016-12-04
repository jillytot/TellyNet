/* eslint new-cap: 0 */
/* eslint padded-blocks: 0 */
/* eslint brace-style: 0 */
const logger = require('winston');
const net = require('net');

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
  console.log('System waiting at http://localhost:8000');
}

function connectionListeners(socket) {

  this.socketConnections.push(socket);
  logger.log('info', new Date() + ' Connection accepted: ' + socket.remoteAddress + ":" + socket.remotePort);

  // 'data' is an event that means that a message was just sent by the
  // client application
  socket.on('data', function (msg_sent) {
    console.log('hit here');
    // Loop through all of our sockets and send the data
    for (var i = 0; i < this.socketConnections.length; i++) {
      // Don't send the data back to the original sender
      if (this.socketConnections[i] == socket) // don't send the message to yourself
        continue;
      // Write the msg sent by chat client
      this.socketConnections[i].write(msg_sent);
    }
  }.bind(this));
  // Use splice to get rid of the socket that is ending.
  // The 'end' event means tcp client has disconnected.
  socket.on('end', function () {
    var i = this.socketConnections.indexOf(socket);
    this.socketConnections.splice(i, 1);
    logger.log('info', (new Date()) + ' Peer ' + socket.remoteAddress + ' disconnected.');
  }.bind(this));
}

module.exports = ConnectionManager;
