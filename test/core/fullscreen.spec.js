import * as sinon from "sinon";

import * as fullscreen from "../../src/core/fullscreen.js";

describe("fullscreen", () => {
    const sandbox = sinon.createSandbox();

    it("adds a touchend listener", () => {
        const mockRoot = {
            addEventListener: sandbox.spy(),
        };

        fullscreen.listenForTap(mockRoot, { scale: { startFullScreen: () => {} } });
        sandbox.assert.calledWith(mockRoot.addEventListener, "touchend");
    });

    it("Removes the event listener on first touch and starts fullscreen", () => {
        const mockRoot = document.createElement("div");
        const mockGame = {
            scale: {
                startFullScreen: sandbox.spy(),
            },
        };

        fullscreen.listenForTap(mockRoot, mockGame);

        mockRoot.dispatchEvent(new Event("touchend"));
        mockRoot.dispatchEvent(new Event("touchend")); //second event should be ignored

        sinon.assert.calledOnce(mockGame.scale.startFullScreen);
    });
});
