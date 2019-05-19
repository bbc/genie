/**
 * The signal bus provides a minimal wrapper for Phaser signals.
 * By importing the bus any signal can be subscribed to or published.
 * A signal is automatically created when the publish or subscribe methods are called if the signal doesn't exist.
 *
 * @example
 * import bus from "./signal-bus.js";
 * const myCallback = data => console.log(data);
 * bus.subscribe({ callback: myCallback, channel: "channelName", name: "signalName" });
 *
 * bus.publish({channel: "channelName", name: "signalName", data: [1,2,3] });
 *
 * @module core/signal-bus
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";

/**
 * Creates a new signal bus.
 * Use the exported const "bus" for a project global singleton
 * @function
 * @returns {{subscribe: function, publish: function, removeChannel: function }} - { {@link module:core/signal-bus.subscribe subscribe}, {@link module:core/signal-bus.publish publish}, {@link module:core/signal-bus.removeChannel removeChannel}, }
 */
export const create = () => {
    const _bus = {};

    const addSignal = message => {
        if (!_bus[message.channel]) {
            _bus[message.channel] = {};
        }
        if (!_bus[message.channel][message.name]) {
            _bus[message.channel][message.name] = new Phaser.Signal();
        }
        return message;
    };

    /**
     * Removes all signal identifiers from a given channel.
     *
     * @function
     * @param {string} channel - Channel name
     * @memberof module:core/signal-bus
     */
    const removeChannel = channel => {
        fp.forOwn(messageName => {
            messageName.dispose();
        }, _bus[channel]);
        delete _bus[channel];
    };

    const addSubscription = message => {
        _bus[message.channel][message.name].add(message.callback);
        return fp.assign(message, { unsubscribe: () => removeSubscription(message) });
    };
    const removeSubscription = message => _bus[message.channel][message.name].remove(message.callback);
    const publishMessage = message => _bus[message.channel][message.name].dispatch(message.data);

    /**
     * Subscribe to a given signal identifier. Create Signal if it doesn't exist.
     *
     * @function
     * @param {Object} message - Message Payload
     * @param {String} message.channel - Channel name
     * @param {String} message.name - Signal identifier
     * @param {Function} message.callback - Signal identifier
     * @memberof module:core/signal-bus
     */
    const subscribe = fp.flow(
        addSignal,
        addSubscription,
    );

    /**
     * Publish to a given signal identifier. Create Signal if it doesn't exist.
     *
     * @function
     * @param {Object} message - Message Payload
     * @param {String} message.channel - Channel name
     * @param {String} message.name - Signal identifier
     * @param {Object=} message.data - Arbitrary data payload sent to all listeners
     * @memberof module:core/signal-bus
     */
    const publish = fp.flow(
        addSignal,
        publishMessage,
    );

    return { subscribe, publish, removeChannel };
};

//Single instance
export const bus = create();
