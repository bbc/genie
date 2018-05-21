import fp from "../../../src/lib/lodash/fp/fp.js";
import { assert } from "chai";
import * as sinon from "sinon";

import * as OverlayLayout from "../../../src/components/overlays/overlay-layout";

describe("Overlay Layout", () => {
    const sandbox = sinon.sandbox.create();
    let overlayLayout;
    let mockLayouts;
    let mockScreen;

    beforeEach(() => {
        mockLayouts = [
            {
                buttons: {
                    audioOff: {
                        input: { enabled: true },
                        update: sandbox.spy(),
                        name: "audioOff",
                    },
                    settings: {
                        input: { enabled: false },
                        update: sandbox.spy(),
                        name: "audioOff",
                    },
                },
            },
        ];

        mockScreen = {
            context: { popupScreens: ["pause", "how-to-play"] },
            scene: {
                getLayouts: sandbox.stub().returns(mockLayouts),
                addToBackground: sandbox.spy(),
            },
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("disables currently enabled buttons", () => {
        const overlayLayout = OverlayLayout.create(mockScreen);
        assert.isFalse(mockLayouts[0].buttons.audioOff.input.enabled);
        assert.isTrue(mockLayouts[0].buttons.audioOff.update.calledOnce);
    });

    describe("addBackground method", () => {
        it("adds a background image and positions it in the correct order", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockBackgroundImage = { inputEnabled: false, input: {} };
            overlayLayout.addBackground(mockBackgroundImage);

            assert.isTrue(mockBackgroundImage.inputEnabled);
            assert.equal(mockBackgroundImage.input.priorityID, 1000);
            assert.deepEqual(mockScreen.scene.addToBackground.getCall(0).args[0], mockBackgroundImage);
        });
    });

    describe("restoreDisabledButtons method", () => {
        it("restores disabled buttons", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            overlayLayout.restoreDisabledButtons();
            assert.isTrue(mockLayouts[0].buttons.audioOff.input.enabled);
            assert.isTrue(mockLayouts[0].buttons.audioOff.update.calledTwice);
        });
    });

    describe("moveGelButtonsToTop method", () => {
        it("restores disabled buttons", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockGelLayout = {
                buttons: {
                    audioOff: {
                        update: sandbox.spy(),
                        input: { priorityID: 0 },
                        parent: {
                            updateTransform: sandbox.spy(),
                            parent: { updateTransform: sandbox.spy() },
                        },
                    },
                },
            };
            overlayLayout.moveGelButtonsToTop(mockGelLayout);
            assert.equal(mockGelLayout.buttons.audioOff.input.priorityID, 1001);
            assert.equal(mockGelLayout.buttons.audioOff.parent.updateTransform.calledOnce, true);
            assert.equal(mockGelLayout.buttons.audioOff.parent.parent.updateTransform.calledOnce, true);
            assert.equal(mockGelLayout.buttons.audioOff.update.calledOnce, true);
        });
    });
});
