/**
 * The signal bus provides a minimal wrapper for Phaser signals.
 * By importing the bus any signal can be subscribed to or published.
 * A signal is automatically created when the publish or subscribe methods are called if the signal doesn't exist.
 *
 * @example
 * import bus from "./signal-bus.js";
 * const myCallback = data => console.log(data);
 * bus.subscribe('mySignalName', myCallBack)
 *
 * bus.publish('mySignalName', {some: 'data'})
 *
 * @module core/signal-bus
 */
import fp from "../lib/lodash/fp/fp.js";

/**
 * Creates a new signal bus.
 * Use the exported const "bus" for a project global singleton
 * @function
 * @returns {{remove: function, subscribe: function, publish: function}} - { {@link module:core/signal-bus.remove remove}, {@link module:core/signal-bus.subscribe subscribe}, {@link module:core/signal-bus.publish publish} }
 */
export const create = () => {
    const _bus = {};

    const addSignal = message => {
        if (!_bus[message.name]) {
            _bus[message.name] = new Phaser.Signal();
        }
        return message;
    };

    /**
     * Remove a given signal identifier from the bus.
     *
     * @function
     * @param {string} name - Signal identifier
     * @memberof module:core/signal-bus
     */
    const remove = name => {
        _bus[name].dispose();
        delete _bus[name];
    };

    const addSubscription = message => _bus[message.name].add(message.callback);
    const publishMessage = message => _bus[message.name].dispatch(message.data);

    /**
     * Subscribe to a given signal identifier. Create Signal if it doesn't exist.
     *
     * @function
     * @param {Object} message - Message Payload
     * @param {Function} message.callback - Signal identifier
     * @memberof module:core/signal-bus
     */
    const subscribe = fp.flow(addSignal, addSubscription);

    /**
     * Publish to a given signal identifier. Create Signal if it doesn't exist.
     *
     * @function
     * @param {Object} message - Message Payload
     * @param {String} message.name - Signal identifier
     * @param {Object=} message.data - Arbitrary data payload sent to all listeners
     * @memberof module:core/signal-bus
     */
    const publish = fp.flow(addSignal, publishMessage);

    return { remove, subscribe, publish };
};

//Single instance
export const bus = create();
