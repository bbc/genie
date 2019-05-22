/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { applyButtonOverrides } from "../../../src/core/layout/button-overrides.js";

describe("button overrides", () => {
    describe("when buttons are passed in", () => {
        const config = {
            theme: {
                "button-overrides": {
                    "gelDesktop.play": {
                        y: 100,
                    },
                    "gelDesktop.how-to-play": {
                        y: 100,
                    },
                },
            },
        };
        const button1 = {
            key: "gelDesktop.play",
            game: {
                cache: {
                    getJSON: () => config,
                },
            },
            y: 0,
            positionOverride: true,
        };
        const button2 = {
            key: "gelDesktop.how-to-play",
            game: {
                cache: {
                    getJSON: () => config,
                },
            },
            y: 0,
        };

        test("applies config values to buttons with positionOverride", () => {
            applyButtonOverrides(1, [button1, button2]);
            expect(button1.y).toBe(100);
        });

        test("takes the scale into account with positionOverride", () => {
            applyButtonOverrides(0.5, [button1, button2]);
            expect(button1.y).toBe(50);
        });

        test("DOES NOT apply config values to buttons without positionOverride", () => {
            applyButtonOverrides(1, [button1, button2]);
            expect(button2.y).toBe(0);
        });
    });
});
