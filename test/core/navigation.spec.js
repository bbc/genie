import { assert } from "chai";
import * as sinon from "sinon";
import { loadNavigation } from "../../src/core/navigation.js";

describe("Navigation - #loadNavigation", () => {
    const sandbox = sinon.sandbox.create();

    let home, select, game, results;

    beforeEach(() => {
        home = sandbox.stub();
        select = sandbox.stub();
        game = sandbox.stub();
        results = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("returns navigation object", () => {
        const navigation = loadNavigation(home, select, game, results);
        const expectedNavigationObject = {
            loadscreen: {
                next: home,
            },
            home: {
                next: select,
            },
            "character-select": {
                next: game,
                home: home,
                restart: home,
            },
            game: {
                next: results,
                home: home,
                restart: game,
            },
            results: {
                next: home,
                game: game,
                restart: game,
                home: home,
            },
        };

        assert.deepEqual(navigation, expectedNavigationObject);
    });

    it("calls 'game' function when calling restart on game", () => {
        const navigation = loadNavigation(home, select, game, results);
        navigation.game.restart();

        sinon.assert.calledOnce(game);
    });

    it("calls 'home' function when calling restart on character-select", () => {
        const navigation = loadNavigation(home, select, game, results);
        navigation["character-select"].restart();

        sinon.assert.calledOnce(home);
    });
});
