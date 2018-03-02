import { assert, expect } from "chai";
import * as sinon from "sinon";

import { Home } from "../../src/components/home";

describe("Home Screen", () => {
    let homeScreen: any;
    let mockGame: any;
    let addToBackgroundSpy: any;
    let gameImageSpy: any;
    let gameButtonSpy: any;

    const mockNext = () => {
        "nextFunc";
    };
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        addToBackgroundSpy = sandbox.spy();
        gameImageSpy = sandbox.spy();
        gameButtonSpy = sandbox.spy();

        mockGame = {
            add: {
                image: gameImageSpy,
                button: gameButtonSpy,
            },
            state: {
                current: "currentState",
            },
        };

        homeScreen = new Home();
        homeScreen.layoutFactory = {
            addToBackground: addToBackgroundSpy,
            keyLookups: {
                currentState: "gameState",
                gelDesktop: "thisIsGel",
                background: "backgroundImage",
                title: "titleImage",
            },
        };
        homeScreen.game = mockGame;
        homeScreen.preload();
        homeScreen.nextFunc = mockNext;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("preload method", () => {
        it("adds current game state to the layout key lookups", () => {
            expect(homeScreen.keyLookup).to.equal("gameState");
        });

        it("adds a key lookup to the current screen", () => {
            assert.exists(homeScreen.keyLookup);
        });
    });
});
