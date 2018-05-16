/**
 * The Sequencer provides a way of showing the game screens in the order defined in {@link ./main.js}.
 * It is a singleton, created in {@link core/startup.js} and added to `context.sequencer`. On creation, it adds
 * the screens to the game state, and starts the first one. It also provides a `next()` function to start
 * the next screen.
 *
 * State can also be passed from screen to screen. The state object has transient or persistent state
 * set on it. Transient state is for storing information about the current game, and persistent state will
 * save the data to local storage. This means that if a player has unlocked certain items in a game, they
 * will be remembered for return visits.
 *
 * @module core/sequencer
 */

import _ from "../lib/lodash/lodash.js";
import * as LayoutFactory from "./layout/factory.js";
import * as Navigation from "./navigation.js";

/**
 * @param  game The instance of Phaser.Game.
 * @param  context The context object.
 */


export function create(game, context) {
    const layoutFactory = LayoutFactory.create(game);
    const navigation = Navigation.create(game.state, context, layoutFactory);
    navigation.init.next();
}


