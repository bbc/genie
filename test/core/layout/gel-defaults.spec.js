import * as sinon from "sinon";
import * as gel from "../../../src/core/layout/gel-defaults";

describe("Layout - Gel Defaults", () => {
    const sandbox = sinon.sandbox.create();
    let mockGame;

    beforeEach(() => {
        mockGame = {
            state: {
                current: "current-screen",
                states: {
                    "current-screen": {
                        navigation: {
                            home: sandbox.spy(),
                        },
                    },
                },
            },
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Home Button Callback", () => {
        it("navigates to the home screen", () => {
            const homeNavigationSpy = mockGame.state.states["current-screen"].navigation.home;
            gel.config.home.action({ game: mockGame });
            sandbox.assert.calledOnce(homeNavigationSpy);
        });
    });
});
