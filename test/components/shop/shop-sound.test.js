/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { playShopSound } from "../../../src/components/shop/shop-sound.js";

describe("playShopSound", () => {
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

    test("plays no sound if no suitable scene audio config and no item audio config", () => {
        playShopSound(mockScene, mockItem, "buy");

        expect(mockScene.sound.play).not.toHaveBeenCalled();
    });

    test("Plays specified sound if configured for scene", () => {
        mockScene.config.confirm.audio.buy = "buy-audio-key";

        playShopSound(mockScene, mockItem, "buy");

        expect(mockScene.sound.play).toHaveBeenCalledWith("test-asset-prefix.buy-audio-key");
    });

    test("Overrides scene default key if sound is configured for item", () => {
        mockScene.config.confirm.audio.buy = "buy-audio-key";
        mockItem.audio = { buy: "item-key" };

        playShopSound(mockScene, mockItem, "buy");

        expect(mockScene.sound.play).toHaveBeenCalledWith("item-key");
    });
});
