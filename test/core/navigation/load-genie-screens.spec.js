import { assert } from "chai";
import * as sinon from "sinon";
import { loadGenieScreens } from "../../../src/core/navigation/load-genie-screens.js";
import { Loadscreen } from "../../../src/components/loadscreen.js";
import { Home } from "../../../src/components/home.js";
import { Select } from "../../../src/components/select.js";
import { GameTest } from "../../../src/components/test-harness/test-screens/game.js";
import { Results } from "../../../src/components/results.js";

describe("Navigation - #loadGenieScreens", () => {
    const sandbox = sinon.sandbox.create();

    let navigation, gameState, addGameState;

    beforeEach(() => {
        navigation = {
            loadscreen: {},
            home: {},
            "character-select": {},
            game: {},
            results: {},
        };
        addGameState = sandbox.stub();
        gameState = { add: addGameState };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("adds screens to game", () => {
        loadGenieScreens(navigation, gameState);

        sinon.assert.callCount(addGameState, 5);
        sinon.assert.calledOnce(addGameState.withArgs("loadscreen", Loadscreen));
        sinon.assert.calledOnce(addGameState.withArgs("home", Home));
        sinon.assert.calledOnce(addGameState.withArgs("character-select", Select));
        sinon.assert.calledOnce(addGameState.withArgs("game", GameTest));
        sinon.assert.calledOnce(addGameState.withArgs("results", Results));
    });

    it("only adds number of screens configured in navigation object", () => {
        navigation = {
            loadscreen: {},
            home: {},
            game: {},
        };

        loadGenieScreens(navigation, gameState);

        sinon.assert.callCount(addGameState, 3);
        sinon.assert.calledOnce(addGameState.withArgs("loadscreen", Loadscreen));
        sinon.assert.calledOnce(addGameState.withArgs("home", Home));
        sinon.assert.calledOnce(addGameState.withArgs("game", GameTest));
    });
});
