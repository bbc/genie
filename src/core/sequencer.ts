import * as _ from "lodash";
import * as LayoutFactory from "./layout/factory";

export function create(
    game: Phaser.Game,
    context: Context,
    transitions: ScreenDef[],
    gameWrapper: HTMLElement,
): Sequencer {
    let currentScreen: ScreenDef = transitions[0];
    const self = {
        next,
        getTransitions,
    };

    const layoutFactory = LayoutFactory.create(game, gameWrapper);

    transitions.forEach(transition => game.state.add(transition.name, transition.state));

    const screenLookup = _.fromPairs(_.map(transitions, (c: any) => [c.name, c]));
    game.state.start(currentScreen.name, true, false, context, next, layoutFactory);

    return self;

    function next(changedState: GameStateUpdate): void {
        const newState = {}; //_.merge({}, context.inState, changedState);
        const nextScreenName = currentScreen.nextScreenName(newState);
        // context.inState = newState;
        //context;
        layoutFactory.removeAll();
        game.state.start(nextScreenName, true, false, context, next, layoutFactory);

        // console.log(`${currentScreen.name} --> ${nextScreenName}`);

        currentScreen = screenLookup[nextScreenName];
    }

    function getTransitions(): ScreenDef[] {
        return transitions;
    }
}
