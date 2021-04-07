/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getSoundKey } from "../../../src/components/shop/shop-sound.js";

describe("getSoundKey", () => {
    let mockScene;
    let mockItem;

    beforeEach(() => {
        mockScene = {
            config: { confirm: { audio: {} } },
            sound: { play: jest.fn() },
            assetPrefix: "test-asset-prefix",
        };
        mockItem = {};
    });

    afterEach(jest.clearAllMocks);

    test("returns undefined if no suitable scene audio config and no item audio config", () => {
        getSoundKey(mockScene, mockItem, "buy");

        expect(getSoundKey(mockScene, mockItem, "buy")).toBeUndefined();
    });

    test("returns specified sound if configured for scene", () => {
        mockScene.config.confirm.audio.buy = "buy-audio-key";
        expect(getSoundKey(mockScene, mockItem, "buy")).toBe("test-asset-prefix.buy-audio-key");
    });

    test("Overrides scene default key if sound if configured for item", () => {
        mockScene.config.confirm.audio.buy = "buy-audio-key";
        mockItem.audio = { buy: "item-key" };

        expect(getSoundKey(mockScene, mockItem, "buy")).toBe("item-key");
    });
});
