/* eslint new-cap: 0 */
/* eslint padded-blocks: 0 */
/* eslint brace-style: 0 */

const express = require('express');
const app = express();
const http = require('http').Server(app);

const config = require('../config/config');
const logger = require('../logs/log');
const ConnectionManager = require('../src/connections/ConnectionManager');

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
const server = http.listen(config.get('port'), config.get('ip'), () => {
  const host = server.address().address;
  const port = server.address().port;

  logger.log('info', 'TellyNet activated http://%s:%s', host, port);

  Twitch.setupConnection(config.get('twitch').events);
});

// this function is called when you want the server to die gracefully
// i.e. wait for existing connections
var gracefulShutdown = function() {
  console.log("Received kill signal, shutting down gracefully.");
  server.close(function() {
    connectionManager.shutDown();
    console.log("Closed out remaining connections.");
    process.exit()
  });

  // if after
  setTimeout(function() {
    console.error("Could not close connections in time, forcefully shutting down");
    connectionManager.shutDown();
    process.exit()
  }, 10*1000);
};

// listen for TERM signal .e.g. kill
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);

const connectionManager = new ConnectionManager(server);
module.exports.cm = connectionManager;
