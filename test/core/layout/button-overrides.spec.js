import { assert } from "chai";
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

        it("applies config values to buttons with positionOverride", () => {
            applyButtonOverrides([button1, button2]);
            assert.equal(button1.y, 100);
        });

        it("DOES NOT apply config values to buttons without positionOverride", () => {
            applyButtonOverrides([button1, button2]);
            assert.equal(button2.y, 0);
        });
    });
});
