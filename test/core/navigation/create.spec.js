import { assert } from "chai";
import * as sinon from "sinon";
import * as GotoScreenWithData from "../../../src/core/navigation/goto-screen-with-data.js";
import * as LoadGenieScreens from "../../../src/core/navigation/load-genie-screens.js";
import * as LoadNavigation from "../../../src/core/navigation.js";
import * as Navigation from "../../../src/core/navigation/create.js";

describe("Navigation - #create", () => {
    let navigation, loadGenieScreens, gameState, context,
        layoutFactory, gotoScreen, loadNavigation;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        navigation = sandbox.stub();
        loadNavigation = sandbox.stub(LoadNavigation, "loadNavigation").returns(navigation);
        gotoScreen = sandbox.stub(GotoScreenWithData, "gotoScreenWithData");
        loadGenieScreens = sandbox.stub(LoadGenieScreens, "loadGenieScreens");
        gameState = sandbox.stub();
        context = sandbox.stub();
        layoutFactory = sandbox.stub();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("loads navigation object", () => {
        Navigation.create(gameState, context, layoutFactory);
        sinon.assert.calledOnce(loadNavigation);
    });

    it("loads genie screens", () => {
        Navigation.create(gameState, context, layoutFactory);
        sinon.assert.calledOnce(loadGenieScreens.withArgs(navigation, gameState));
    });

    it("goes to loadscreen", () => {
        Navigation.create(gameState, context, layoutFactory);
        sinon.assert.calledOnce(gotoScreen.withArgs("loadscreen"));
    });
});
