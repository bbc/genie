import { assert } from "chai";
import * as sinon from "sinon";
import * as Navigation from "../../src/core/navigation.js";
import * as signal from "../../src/core/signal-bus.js";
import { Loadscreen } from "../../src/components/loadscreen.js";
import { Home } from "../../src/components/home.js";

describe("Navigation", () => {
    let gameState,
        context,
        layoutFactory,
        navigationConfig,
        loadGenieScreens,
        transientData,
        navigation,
        signalBusRemoveChannel;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        gameState = {
            add: sandbox.stub(),
            start: sandbox.stub(),
        };
        context = sandbox.stub();
        layoutFactory = { removeAll: sandbox.stub() };
        transientData = undefined;
        navigation = {
            loadscreen: {
                state: Loadscreen,
                routes: {
                    next: sandbox.stub(),
                },
            },
            home: {
                state: Home,
                routes: {
                    next: sandbox.stub(),
                },
            },
        };
        navigationConfig = () => navigation;
        signalBusRemoveChannel = sandbox.spy(signal.bus, "removeChannel");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("loads correct genie screens", () => {
        Navigation.create(gameState, context, layoutFactory, navigationConfig);

        sinon.assert.calledTwice(gameState.add);
        sinon.assert.calledOnce(gameState.add.withArgs("loadscreen", Loadscreen));
        sinon.assert.calledOnce(gameState.add.withArgs("home", Home));
    });

    it("goes to loadscreen", () => {
        Navigation.create(gameState, context, layoutFactory, navigationConfig);

        sinon.assert.calledOnce(
            gameState.start.withArgs("loadscreen", true, false, transientData, layoutFactory, context, navigation),
        );
    });

    it("removes signal bus gel-buttons channel before going to screen", () => {
        Navigation.create(gameState, context, layoutFactory, navigationConfig);

        sinon.assert.calledOnce(signal.bus.removeChannel.withArgs("gel-buttons"));
    });

    it("clears down layout before going to screen", () => {
        Navigation.create(gameState, context, layoutFactory, navigationConfig);

        sinon.assert.calledOnce(layoutFactory.removeAll);
    });
});
