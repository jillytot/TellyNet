


function StreamParser() {
}

/**
 *
 * @param user
 * @param message
 * @returns {{user: *, message: *, timestamp: *, subscriber: *, mod: (*|module.exports.mod), message_type: *}}
 */
StreamParser.prototype.parseTwitchContent = function(user, message) {

  return {
    user: user,
    message: message,
    timestamp: user['sent-ts'],
    subscriber: user.subscriber,
    mod: user.mod,
    message_type: user['message-type']
  }
};

module.exports = new StreamParser();
