/**
 *  StreamParser
 */

const commands = {
  left: 'left',
  l: 'left',
  right: 'right',
  r: 'right',
  up: 'up',
  u: 'up',
  down: 'down',
  d: 'down',
  ll: 'left left'
};

/**
 *
 * @constructor
 */
function StreamParser() {
}

/**
 *
 * @param user
 * @param message
 * @returns {{user: *, message: *, timestamp: *, subscriber: *, mod: (*|module.exports.mod), message_type: *}}
 */
StreamParser.prototype.parseTwitchContent = function (user, message) {
  if (commands[message]) {
    console.log(message);
  }

  return {
    user: user.username,
    message: message,
    timestamp: user['sent-ts'],
    userTypes: {
      subscriber: user.subscriber,
      mod: user.mod,
      turbo: user.turbo
    },
    messageType: user['message-type']
  };
};

module.exports = new StreamParser();
