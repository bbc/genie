/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as fullscreen from "../../src/core/fullscreen.js";

describe("Fullscreen", () => {
    it("adds a touchend listener", () => {
        const mockRoot = { addEventListener: jest.fn() };
        fullscreen.listenForTap(mockRoot, { scale: { startFullScreen: () => {} } });
        expect(mockRoot.addEventListener.mock.calls[0][0]).toBe("touchend");
    });

    it("Removes the event listener on first touch and starts fullscreen", () => {
        const mockRoot = document.createElement("div");
        const mockGame = {
            scale: {
                startFullScreen: jest.fn(),
            },
        };

        fullscreen.listenForTap(mockRoot, mockGame);

        mockRoot.dispatchEvent(new Event("touchend"));
        mockRoot.dispatchEvent(new Event("touchend")); //second event should be ignored

        expect(mockGame.scale.startFullScreen).toHaveBeenCalledTimes(1);
    });
});
