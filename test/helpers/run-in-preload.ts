import { PromiseTrigger } from "../../src/core/promise-utils";
import { Screen } from "../../src/core/screen";
import { startup } from "../../src/core/startup";

/**
 * Wraps a test in asynchronous Phaser setup and shutdown code, and runs it in the preload phase of the first state.
 * @param action Function to run the tests, returning a promise.
 */
function runInPreload(action: (g: Phaser.Game) => Promise<void>): Promise<void> {
    const promisedTest = new PromiseTrigger<void>();
    const testState = new class extends Screen {
        public preload() {
            promisedTest.resolve(action(this.game));
        }
    }();
    const transitions = [
        {
            name: "loadscreen",
            state: testState,
            nextScreenName: () => "loadscreen",
        },
    ];
    return startup(transitions)
        .then(game => promisedTest.then(() => game))
        .then(game => game.destroy());
}

export default runInPreload;
