import * as sinon from "sinon";
import { Home } from "../../src/components/home.js";
import { Loadscreen } from "../../src/components/loadscreen.js";
import * as Navigation from "../../src/core/navigation.js";
import * as signal from "../../src/core/signal-bus.js";
import { assert } from "chai";

describe("Navigation", () => {
    let gameState, context, scene, navigationConfig, transientData, navigation;

    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        gameState = {
            add: sandbox.stub(),
            start: sandbox.stub(),
            game: { canvas: { focus: sinon.stub() } },
        };
        context = sandbox.stub();
        scene = { removeAll: sandbox.stub() };
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
        sandbox.stub(signal.bus, "removeChannel");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("loads correct genie screens", () => {
        Navigation.create(gameState, context, scene, navigationConfig);

        sinon.assert.calledTwice(gameState.add);
        sinon.assert.calledOnce(gameState.add.withArgs("loadscreen", Loadscreen));
        sinon.assert.calledOnce(gameState.add.withArgs("home", Home));
    });

    it("goes to loadscreen", () => {
        Navigation.create(gameState, context, scene, navigationConfig);

        sinon.assert.calledOnce(
            gameState.start.withArgs("loadscreen", true, false, transientData, scene, context, navigation),
        );
    });

    it("removes signal bus gel-buttons channel before going to screen", () => {
        Navigation.create(gameState, context, scene, navigationConfig);

        sinon.assert.calledOnce(signal.bus.removeChannel.withArgs("gel-buttons"));
    });

    it("clears down layout before going to screen", () => {
        Navigation.create(gameState, context, scene, navigationConfig);

        sinon.assert.calledOnce(scene.removeAll);
    });

    it("It returns a function", () => {
        assert.isFunction(Navigation.create(gameState, context, scene, navigationConfig));
    });
});
