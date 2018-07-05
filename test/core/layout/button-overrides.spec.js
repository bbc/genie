import { assert } from "chai";
import { applyButtonOverrides } from "../../../src/core/layout/button-overrides.js";

describe("button overrides", () => {
    describe("when button is passed in", () => {
        const config = {
            theme: {
                "button-overrides": {
                    "gelDesktop.play": {
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

        it("applies config values to button1 but not button2", () => {
            applyButtonOverrides([button1, button2]);
            assert.equal(button1.y, 100);
            assert.equal(button2.y, 0);
        });
    });
});
