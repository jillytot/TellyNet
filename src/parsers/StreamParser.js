function StreamParser() {
}

/**
 *
 * @param user
 * @param message
 * @returns {{user: *, message: *, timestamp: *, subscriber: *, mod: (*|module.exports.mod), message_type: *}}
 */
StreamParser.prototype.parseTwitchContent = function (user, message) {
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
