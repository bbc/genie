/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as visibleLayer from "../../src/core/visible-layer.js";

describe("Visible Layer", () => {
    describe("get method", () => {
        test("returns the current game screen if there are no overlays", () => {
            const fakeSceneInstance = { scene: { key: "character-select" } };
            const fakeContext = { popupScreens: [] };
            const actualGameScreen = visibleLayer.get(fakeSceneInstance, fakeContext);
            expect(actualGameScreen).toEqual("character-select");
        });

        test("returns the current overlay screen if there are any", () => {
            const fakeSceneInstance = { scene: { key: "character-select" } };
            const fakeContext = { popupScreens: ["pause", "how-to-play"] };
            const actualGameScreen = visibleLayer.get(fakeSceneInstance, fakeContext);
            expect(actualGameScreen).toEqual("how-to-play");
        });
    });
});
