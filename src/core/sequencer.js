import _fromPairs from "lodash/fromPairs";
import _map from "lodash/map";
import _merge from "lodash/merge";
import * as LayoutFactory from "./layout/factory.js";

export function create(game, context, transitions) {
    let currentScreen = transitions[0];

    const self = { getTransitions };
    const layoutFactory = LayoutFactory.create(game);

    transitions.forEach(transition => game.state.add(transition.name, transition.state));

    const screenLookup = _fromPairs(_map(transitions, c => [c.name, c]));
    game.state.start(currentScreen.name, true, false, context, next, layoutFactory);

    return self;

    function next(changedState) {
        //TODO: Use GMI to save persistent state to local storage, if it has been updated
        const newState = _merge({}, context.inState, changedState);
        const nextScreenName = currentScreen.nextScreenName(newState);
        context.inState = newState;
        layoutFactory.removeAll();
        game.state.start(nextScreenName, true, false, context, next, layoutFactory);

        currentScreen = screenLookup[nextScreenName];
    }

    function getTransitions() {
        return transitions;
    }
}
