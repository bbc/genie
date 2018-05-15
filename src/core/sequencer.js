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
import * as signal from "./signal-bus.js";

/**
 * @param  game The instance of Phaser.Game.
 * @param  context The context object.
 * @param  transitions A JSON object with transitions, from the main.js file.
 * @returns {{getTransitions: function}}
 */


export function create(game, context, transitions) {
    console.log("sequencer.js - create");
    let currentScreen = Object.values(transitions)[0];
    console.log("sequencer.js - currentScreen initialized", currentScreen);
    const layoutFactory = LayoutFactory.create(game);

    //transitions.forEach(transition => game.state.add(transition.name, transition.state));

    console.log("sequencer.js - create - before addStates");
    addStates(game, context, transitions, layoutFactory);
    console.log("sequencer.js - create - after  addStates");

    const screenLookup = _.fromPairs(_.map(transitions, c => [c.name, c]));
    console.log("sequencer.js - create - about to run game.state.start - ");
    game.state.start(currentScreen.next({ game, context, screens: transitions, layoutFactory}).name, true, false, context, transitions, layoutFactory);
    console.log("sequencer.js - create - successfully ran game.state.start");

    //function next(changedState) {
    //    signal.bus.removeChannel("gel-buttons");
    //    const newState = _.merge({}, context.inState, changedState);
    //    const nextScreenName = currentScreen.nextScreenName(newState);
    //    context.inState = newState;
    //    layoutFactory.removeAll();
    //    game.state.start(nextScreenName, true, false, context, next, layoutFactory);

    //    currentScreen = screenLookup[nextScreenName];
    //}

    const getTransitions = () => transitions;

    return { getTransitions };
}

// Adds all states from transitions object
// to Phaser so they are ready to use.
function addStates(game, context, screens, layoutFactory) {
    console.log("sequencer.js - addStates --------");
    let names = [];
    _.forOwn(screens, screen => {
        console.log("sequencer.js - addStates - screen = ", screen);
        _.forOwn(screen, button => {
            const state = button({ game, context, screens, layoutFactory });
            const alreadyAdded = names.indexOf(state.name) > -1;

            if (!alreadyAdded) {
                console.log("sequencer.js - addStates - button state = ", state.name);
                game.state.add(state.name, state.state);
                names.push(state.name);
            }
        });
    });
    console.log("sequencer.js - addStates end --------");
};
