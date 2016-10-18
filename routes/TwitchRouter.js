const Twitch = require('../controllers/TwitchController');

module.exports = function (app) {
  app.get('/api/twitchSetup', Twitch.setupConnection);
};
