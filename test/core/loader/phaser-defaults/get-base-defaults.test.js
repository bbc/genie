/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getBaseDefaults } from "../../../../src/core/loader/phaser-defaults/base-defaults.js";

describe("Base Phaser Defaults", () => {
    beforeEach(() => {
        global.__GENIE__ = { version: "test version" };
    });

    afterEach(jest.clearAllMocks);

    test("Returns correct config", () => {
        const baseDefaults = getBaseDefaults();
        expect(baseDefaults.width).toBe(1400);
        expect(baseDefaults.height).toBe(600);
        expect(baseDefaults.antialias).toBe(true);
        expect(baseDefaults.multiTexture).toBe(true);
        expect(baseDefaults.banner).toBe(true);
        expect(baseDefaults.title).toEqual("BBC Games Genie");
        expect(baseDefaults.version).toEqual("test version");
        expect(baseDefaults.clearBeforeRender).toBe(false);
        expect(baseDefaults.scale).toEqual({ mode: Phaser.Scale.NONE });
        expect(baseDefaults.input).toEqual({ windowEvents: false });
    });
});
