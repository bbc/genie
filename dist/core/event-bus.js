/**
 * The event bus provides a minimal wrapper for Phaser events.
 * By importing the bus any event can be subscribed to or published.
 * A event is automatically created when the publish or subscribe methods are called if the event doesn't exist.
 *
 * @example
 * import bus from "./event-bus.js";
 * const myCallback = data => console.log(data);
 * bus.subscribe({ callback: myCallback, channel: "channelName", name: "eventName" });
 *
 * bus.publish({channel: "channelName", name: "eventName", data: [1,2,3] });
 *
 * @module core/event-bus
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";
/**
 * Creates a new event bus.
 * Use the exported const "bus" for a project global singleton
 * @function
 * @returns {{subscribe: function, publish: function, removeChannel: function }} - { {@link module:core/event-bus.subscribe subscribe}, {@link module:core/event-bus.publish publish}, {@link module:core/event-bus.removeChannel removeChannel}, }
 */

export var create = function create() {
  var _bus = {};

  var addEvent = function addEvent(message) {
    if (!_bus[message.channel]) {
      _bus[message.channel] = new Phaser.Events.EventEmitter();
    }

    return message;
  };
  /**
   * Removes all event identifiers from a given channel.
   *
   * @function
   * @param {string} channel - Channel name
   * @memberof module:core/event-bus
   */


  var removeChannel = function removeChannel(channel) {
    if (_bus[channel]) {
      _bus[channel].destroy();

      delete _bus[channel];
    }
  };

  var addSubscription = function addSubscription(message) {
    _bus[message.channel].on(message.name, message.callback);

    return fp.assign(message, {
      unsubscribe: function unsubscribe() {
        return removeSubscription(message);
      }
    });
  };

  var removeSubscription = function removeSubscription(message) {
    _bus[message.channel] && _bus[message.channel].off(message.name, message.callback);
  };

  var publishMessage = function publishMessage(message) {
    return _bus[message.channel].emit(message.name, message.data);
  };
  /**
   * Subscribe to a given event identifier. Create Event if it doesn't exist.
   *
   * @function
   * @param {Object} message - Message Payload
   * @param {String} message.channel - Channel name
   * @param {String} message.name - Event identifier
   * @param {Function} message.callback - Event identifier
   * @memberof module:core/event-bus
   */


  var subscribe = fp.flow(addEvent, addSubscription);
  /**
   * Publish to a given event identifier. Create Event if it doesn't exist.
   *
   * @function
   * @param {Object} message - Message Payload
   * @param {String} message.channel - Channel name
   * @param {String} message.name - Event identifier
   * @param {Object=} message.data - Arbitrary data payload sent to all listeners
   * @memberof module:core/event-bus
   */

  var publish = fp.flow(addEvent, publishMessage);
  return {
    subscribe: subscribe,
    publish: publish,
    removeChannel: removeChannel,
    removeSubscription: removeSubscription
  };
}; //Single instance

export var eventBus = create();