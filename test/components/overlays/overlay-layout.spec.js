/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";
import * as OverlayLayout from "../../../src/components/overlays/overlay-layout";

describe("Overlay Layout", () => {
    const sandbox = sinon.createSandbox();
    let mockLayouts;
    let mockScreen;

    beforeEach(() => {
        mockLayouts = [
            {
                buttons: {
                    audio: {
                        input: { enabled: true },
                        update: sandbox.spy(),
                        name: "audio",
                    },
                    settings: {
                        input: { enabled: false },
                        update: sandbox.spy(),
                        name: "audio",
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

    describe("addBackground method", () => {
        it("adds a background image and positions it in the correct order", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockBackgroundImage = { inputEnabled: false, input: {} };
            overlayLayout.addBackground(mockBackgroundImage);

            assert.isTrue(mockBackgroundImage.inputEnabled);
            assert.equal(mockBackgroundImage.input.priorityID, 1002);
            assert.deepEqual(mockScreen.scene.addToBackground.getCall(0).args[0], mockBackgroundImage);
        });
    });

    describe("moveGelButtonsToTop method", () => {
        it("moves buttons to the top layer", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockGelLayout = {
                buttons: {
                    audio: {
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
            assert.equal(mockGelLayout.buttons.audio.input.priorityID, 1003);
            assert.equal(mockGelLayout.buttons.audio.parent.updateTransform.calledOnce, true);
            assert.equal(mockGelLayout.buttons.audio.parent.parent.updateTransform.calledOnce, true);
            assert.equal(mockGelLayout.buttons.audio.update.calledOnce, true);
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
            assert.equal(mockItem.input.priorityID, 1003);
        });
    });
});
