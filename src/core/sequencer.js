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
import * as Scene from "./scene.js";
import * as signal from "./signal-bus.js";

/**
 * @param  game The instance of Phaser.Game.
 * @param  context The context object.
 * @param  transitions A JSON object with transitions, from the main.js file.
 * @returns {{getTransitions: function}}
 */
export function create(game, context, transitions) {
    let currentScreen = transitions[0];
    const scene = Scene.create(game);

    transitions.forEach(transition => game.state.add(transition.name, transition.state));

    const screenLookup = _.fromPairs(_.map(transitions, c => [c.name, c]));
    game.state.start(currentScreen.name, true, false, context, next, scene);

    function next(changedState) {
        signal.bus.removeChannel("gel-buttons");
        //TODO: Use GMI to save persistent state to local storage, if it has been updated
        const newState = _.merge({}, context.inState, changedState);
        const nextScreenName = currentScreen.nextScreenName(newState);
        context.inState = newState;
        scene.removeAll();
        game.state.start(nextScreenName, true, false, context, next, scene);

        currentScreen = screenLookup[nextScreenName];
    }

    const getTransitions = () => transitions;

    return { getTransitions };
}
