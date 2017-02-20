/**
 *  StreamParser
 */

/**
 *
 * @constructor
 */
function StreamParser() {
}

/**
 *
 * @param action
 * @param channel
 * @param userstate
 * @param message
 * @returns {{platform: string, channel: *, username: (*|conf.twitch.username|{doc, default}), message_id: undefined, action: *, system_message: undefined, admin_level: undefined, bits_level: *, bits: *, subscriber: *}}
 */
StreamParser.prototype.parseTwitchContent = function (action, channel, userstate, message) {

  if (!userstate) {
    throw new Error('Userstate was not defined');
  }

  return {
    platform: 'twitch',
    channel: channel,
    username: userstate.username,
    message_id: undefined,
    action: action,
    admin_level: undefined,
    bits_level: userstate.bits,
    bits: userstate.bits,
    subscriber: userstate.subscriber,
    message: message
  };
};

module.exports = new StreamParser();
