import { assert } from "chai";
import * as sinon from "sinon";
import { Home } from "../../src/components/home";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";
import * as signal from "../../src/core/signal-bus.js";
import { buttonsChannel } from "../../src/core/layout/gel-defaults.js";

describe("Home Screen", () => {
    let homeScreen;
    let layoutHarnessSpy;
    let mockGame;
    let mockContext;
    let addToBackgroundSpy;
    let addLayoutSpy;
    let gameImageStub;
    let gameButtonSpy;
    let navigationNext;

    const sandbox = sinon.createSandbox();

    beforeEach(() => {
        layoutHarnessSpy = sandbox.spy(layoutHarness, "createTestHarnessDisplay");
        addToBackgroundSpy = sandbox.spy();
        addLayoutSpy = sandbox.spy();
        gameImageStub = sandbox.stub();
        gameImageStub.onCall(0).returns("background");
        gameImageStub.onCall(1).returns("title");
        gameButtonSpy = sandbox.spy();
        navigationNext = sandbox.stub();

        mockGame = {
            add: {
                image: gameImageStub,
                button: gameButtonSpy,
            },
            state: {
                current: "homeScreen",
            },
        };

        mockContext = {
            config: { theme: { home: {} } },
        };

        homeScreen = new Home();
        homeScreen.scene = {
            addToBackground: addToBackgroundSpy,
            addLayout: addLayoutSpy,
        };
        homeScreen.navigation = {
            next: navigationNext,
        };
        homeScreen.game = mockGame;
        homeScreen.context = mockContext;
        homeScreen.preload();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("create method", () => {
        beforeEach(() => homeScreen.create());

        it("adds a background image", () => {
            const actualImageCall = gameImageStub.getCall(0);
            const expectedImageCall = [0, 0, "home.background"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = addToBackgroundSpy.getCall(0);
            assert.deepEqual(addToBackgroundCall.args, ["background"]);
        });

        it("adds a title image", () => {
            const actualImageCall = gameImageStub.getCall(1);
            const expectedImageCall = [0, -150, "home.title"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = addToBackgroundSpy.getCall(1);
            assert.deepEqual(addToBackgroundCall.args, ["title"]);
        });

        it("adds GEL buttons to layout", () => {
            const actualButtons = addLayoutSpy.getCall(0).args[0];
            const expectedButtons = ["exit", "howToPlay", "play", "audio", "settings"];
            assert.deepEqual(actualButtons, expectedButtons);
        });

        it("creates a layout harness with correct params", () => {
            const actualParams = layoutHarnessSpy.getCall(0).args;
            const expectedParams = [mockGame, mockContext, homeScreen.scene];
            assert(layoutHarnessSpy.callCount === 1, "layout harness should be called once");
            assert.deepEqual(actualParams, expectedParams);
        });
    });

    describe("signals", () => {
        let signalSubscribeSpy;

        beforeEach(() => {
            signalSubscribeSpy = sandbox.spy(signal.bus, "subscribe");
            homeScreen.create();
        });

        it("adds a signal subscription to the play button", () => {
            assert.deepEqual(signalSubscribeSpy.getCall(0).args[0].channel, buttonsChannel);
            assert.deepEqual(signalSubscribeSpy.getCall(0).args[0].name, "play");
        });

        it("adds a callback for the play button", () => {
            signalSubscribeSpy.getCall(0).args[0].callback();
            assert(homeScreen.navigation.next.callCount === 1, "next function should have been called once");
        });
    });
});
