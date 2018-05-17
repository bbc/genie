import { assert } from "chai";
import * as sinon from "sinon";
import * as signal from "../../../src/core/signal-bus.js";
import { gotoScreenWithData } from "../../../src/core/navigation/goto-screen-with-data.js";

describe("Navigation - #gotoScreenWithData", () => {
    const sandbox = sinon.sandbox.create();

    let transientData,
        gameState,
        startGameState,
        layoutFactory,
        removeAllLayout,
        context,
        navigation,
        removeSignalChannel;

    beforeEach(() => {
        transientData = sandbox.stub();
        startGameState = sandbox.stub();
        removeAllLayout = sandbox.stub();
        layoutFactory = { removeAll: removeAllLayout };
        gameState = { start: startGameState };
        navigation = sandbox.stub();
        removeSignalChannel = sandbox.stub(signal.bus, "removeChannel");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("removes existing layout", () => {
        gotoScreenWithData("character-select", transientData, gameState, layoutFactory, context, navigation);

        sinon.assert.calledOnce(removeSignalChannel.withArgs("gel-buttons"));
        sinon.assert.calledOnce(removeAllLayout);
    });

    it("starts correct Phaser state with correct data passed through", () => {
        gotoScreenWithData("home", transientData, gameState, layoutFactory, context, navigation);

        sinon.assert.calledOnce(
            startGameState.withArgs("home", true, false, transientData, layoutFactory, context, navigation),
        );
    });
});
