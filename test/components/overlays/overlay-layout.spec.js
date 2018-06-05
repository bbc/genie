import { assert } from "chai";
import * as sinon from "sinon";
import * as OverlayLayout from "../../../src/components/overlays/overlay-layout";

describe("Overlay Layout", () => {
    const sandbox = sinon.sandbox.create();
    let mockLayouts;
    let mockScreen;
    let mockGameButtons;

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

        mockGameButtons = [
            {
                input: { enabled: true },
                update: sandbox.spy(),
                name: "button1",
            },
        ];

        mockScreen = {
            context: { popupScreens: ["pause", "how-to-play"] },
            scene: {
                getLayouts: sandbox.stub().returns(mockLayouts),
                getAccessibleGameButtons: sandbox.stub().returns(mockGameButtons),
                addToBackground: sandbox.spy(),
            },
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("disables currently enabled buttons", () => {
        OverlayLayout.create(mockScreen);
        assert.isFalse(mockLayouts[0].buttons.audioOff.input.enabled);
        assert.isFalse(mockGameButtons[0].input.enabled);
        assert.isTrue(mockLayouts[0].buttons.audioOff.update.calledOnce);
        assert.isTrue(mockGameButtons[0].update.calledOnce);
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
            assert.isTrue(mockGameButtons[0].input.enabled);
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

    describe("moveToTop method", () => {
        it("moves an item to the top layer", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockItem = {
                inputEnabled: false,
                input: { priorityID: 0 },
            };
            overlayLayout.moveToTop(mockItem);
            assert.isTrue(mockItem.inputEnabled);
            assert.equal(mockItem.input.priorityID, 1001);
        });
    });
});
