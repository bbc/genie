import fp from "../../../src/lib/lodash/fp/fp.js";
import { assert } from "chai";
import * as sinon from "sinon";

import * as OverlayLayout from "../../../src/components/overlays/overlay-layout";

describe("Overlay Layout", () => {
    const sandbox = sinon.sandbox.create();
    let overlayLayout;
    let mockScreen;

    beforeEach(() => {
        mockScreen = {
            context: { popupScreens: ["pause", "how-to-play"] },
            layoutFactory: {
                getLayouts: sandbox.stub().returns([
                    {
                        button: { input: "enabled" },
                    },
                ]),
                addToBackground: sandbox.spy(),
            },
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("addBackground method", () => {
        it("adds a background image and positions it in the correct order", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockBackgroundImage = { inputEnabled: false, input: {} };
            overlayLayout.addBackground(mockBackgroundImage);

            assert.isTrue(mockBackgroundImage.inputEnabled);
            assert.equal(mockBackgroundImage.input.priorityID, 1000);
            assert.deepEqual(mockScreen.layoutFactory.addToBackground.getCall(0).args[0], mockBackgroundImage);
        });
    });

    describe("disableExistingButtons method", () => {
        it("adds a background image and positions it in the correct order", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockBackgroundImage = { inputEnabled: false, input: {} };
            overlayLayout.addBackground(mockBackgroundImage);

            assert.isTrue(mockBackgroundImage.inputEnabled);
            assert.equal(mockBackgroundImage.input.priorityID, 1000);
            assert.deepEqual(mockScreen.layoutFactory.addToBackground.getCall(0).args[0], mockBackgroundImage);
        });
    });

    describe("restoreDisabledButtons method", () => {

    });

    describe("moveGelButtonsToTop method", () => {

    });
});
