
const express = require('express');
const app = express();
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
var routePath = './routes/'; //add one folder then put your route files there my router folder name is routers
fs.readdirSync(routePath).forEach(function(file) {
  var route = '../' + routePath + file;
  require(route)(app);
});

/**
 * Connecting to the express server
 * @type {http.Server}
 */
const server = app.listen(config.get('port'), function() {
  const host = server.address().address;
  const port = server.address().port;

  logger.log('info', 'TellyNet activated http://%s:%s', host, port);

  //@TODO: provide list of channels and loop through
  Twitch.setupConnection(config.get('twitch').channels[0]);

});
