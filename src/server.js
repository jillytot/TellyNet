/* eslint new-cap: 0 */
/* eslint padded-blocks: 0 */
/* eslint brace-style: 0 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const WebSocketServer = require('websocket').server;

const config = require('../config/config');
const logger = require('../logs/log');

const Twitch = require('../controllers/TwitchController');

app.get('/', function (req, res) {
  res.send('TellyNet is up and running');
});

/**
 * Setup express routing
 */
const fs = require('fs');
var routePath = './routes/'; // add one folder then put your route files there my router folder name is routers
fs.readdirSync(routePath).forEach(file => {
  var route = '../' + routePath + file;
  require(route)(app);
});

/**
 * Connecting to the express server
 * @type {http.Server}
 */
const server = http.listen(config.get('port'), () => {
  const host = server.address().address;
  const port = server.address().port;

  logger.log('info', 'TellyNet activated http://%s:%s', host, port);

  Twitch.setupConnection(config.get('twitch').events);

});

/**
 *  Web Sockets Section
 */

const wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

function originIsAllowed(origin) {
  console.log(origin);
  //@TODO: Set the origin of the web socket and verifiy here
  //return config.get('allowedOrigins').indexOf(origin) !== -1;
  return true;
}

wsServer.on('request', request => {

  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    logger.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    return;
  }

  const connection = request.accept(undefined, request.origin);

  logger.log(new Date() + ' Connection accepted.');
  connection.on('message', message => {
    if (message.type === 'utf8') {
      console.log('Received Message: ' + message.utf8Data);
      connection.sendUTF(message.utf8Data);
    }
    else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      connection.sendBytes(message.binaryData);
    }
  });

  connection.on('close', () => {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});
