import * as _ from "lodash";

import { Screen } from "./screen";

export type GameState = TransientState & PersistentState;

export interface TransientState {
    transient: any;
}

export interface PersistentState {
    persistent: any;
}

export type GameStateUpdate = GameState | TransientState | PersistentState | {};

export interface Sequencer {
    getTransitions(): ScreenDef[];
}

export type NextScreenFunction = (state: GameStateUpdate) => string;

export interface ScreenDef {
    name: string;
    state: Screen;
    nextScreenName: NextScreenFunction;
}

export function create(game: Phaser.Game, context: Context, transitions: ScreenDef[]): Sequencer {
    let currentScreen: ScreenDef = transitions[0];
    const self = {
        getTransitions,
    };

    transitions.forEach(c => game.state.add(c.name, c.state));
    const screenLookup = _.fromPairs(_.map(transitions, (c: any) => [c.name, c]));
    game.state.start(currentScreen.name, true, false, context, next);

    return self;

    function next(changedState: GameStateUpdate): void {
        const newState = {}; //_.merge({}, context.inState, changedState);
        const nextScreenName = currentScreen.nextScreenName(newState);
        // context.inState = newState;
        game.state.start(nextScreenName, true, false, context);

        // console.log(`${currentScreen.name} --> ${nextScreenName}`);

        currentScreen = screenLookup[nextScreenName];
    }

    function getTransitions(): ScreenDef[] {
        return transitions;
    }
}
