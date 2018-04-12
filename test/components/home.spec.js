import { assert } from "chai";
import * as sinon from "sinon";

import { Home } from "../../src/components/home";
import * as signal from "../../src/core/signal-bus.js";
import * as layoutHarness from "../../src/components/test-harness/layout-harness.js";

describe("Home Screen", () => {
    let homeScreen;
    let layoutHarnessSpy;
    let mockGame;
    let mockContext;
    let addToBackgroundSpy;
    let addLayoutSpy;
    let gameImageStub;
    let gameButtonSpy;

    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        layoutHarnessSpy = sandbox.spy(layoutHarness, "createTestHarnessDisplay");
        addToBackgroundSpy = sandbox.spy();
        addLayoutSpy = sandbox.spy();
        gameImageStub = sandbox.stub();
        gameImageStub.onCall(0).returns("background");
        gameImageStub.onCall(1).returns("title");
        gameButtonSpy = sandbox.spy();

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
            qaMode: { active: false },
        };

        homeScreen = new Home();
        homeScreen.layoutFactory = {
            addToBackground: addToBackgroundSpy,
            addLayout: addLayoutSpy,
            keyLookups: {
                homeScreen: {
                    background: "backgroundImage",
                    title: "titleImage",
                },
            },
        };
        homeScreen.game = mockGame;
        homeScreen.context = mockContext;
        homeScreen.preload();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("preload method", () => {
        it("adds current game state to the layout key lookups", () => {
            const expectedKeylookups = homeScreen.layoutFactory.keyLookups.homeScreen;
            assert.deepEqual(homeScreen.keyLookup, expectedKeylookups);
        });

        it("adds a key lookup to the current screen", () => {
            assert.exists(homeScreen.keyLookup);
        });
    });

    describe("create method", () => {
        beforeEach(() => homeScreen.create());

        it("adds a background image", () => {
            const actualImageCall = gameImageStub.getCall(0);
            const expectedImageCall = [0, 0, "backgroundImage"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = addToBackgroundSpy.getCall(0);
            assert.deepEqual(addToBackgroundCall.args, ["background"]);
        });

        it("adds a title image", () => {
            const actualImageCall = gameImageStub.getCall(1);
            const expectedImageCall = [0, -150, "titleImage"];
            assert.deepEqual(actualImageCall.args, expectedImageCall);

            const addToBackgroundCall = addToBackgroundSpy.getCall(1);
            assert.deepEqual(addToBackgroundCall.args, ["title"]);
        });

        it("adds GEL buttons to layout", () => {
            const actualButtons = addLayoutSpy.getCall(0).args[0];
            const expectedButtons = ["exit", "howToPlay", "play", "audioOff", "settings"];
            assert.deepEqual(actualButtons, expectedButtons);
        });

        it("creates a layout harness with correct params", () => {
            const actualParams = layoutHarnessSpy.getCall(0).args;
            const expectedParams = [mockGame, mockContext, homeScreen.layoutFactory];
            assert(layoutHarnessSpy.callCount === 1, "layout harness should be called once");
            assert.deepEqual(actualParams, expectedParams);
        });
    });

    describe("signals", () => {
        let signalSubscribeSpy;

        beforeEach(() => {
            signalSubscribeSpy = sandbox.spy(signal.bus, "subscribe");
            homeScreen.create();
            homeScreen.next = sandbox.spy();
        });

        it("adds a signal subscription to the play button", () => {
            assert.deepEqual(signalSubscribeSpy.getCall(0).args[0].name, "GEL-play");
        });

        it("adds a callback for the play button", () => {
            signalSubscribeSpy.getCall(0).args[0].callback();
            assert(homeScreen.next.callCount === 1, "next function should have been called once");
        });
    });
});
