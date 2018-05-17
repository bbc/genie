import { assert } from "chai";
import fp from "lodash/fp";
import * as sinon from "sinon";
import { loadAssets } from "../../../src/core/asset-loader";
import { GameAssets } from "../../../src/core/game-assets";
import { GelButton } from "../../../src/core/layout/gel-button";
import { buttonsChannel } from "../../../src/core/layout/gel-defaults.js";
import { Screen } from "../../../src/core/screen";
import * as signal from "../../../src/core/signal-bus.js";
import { startup } from "../../../src/core/startup";
import { assetPacks } from "../../helpers/asset-packs";
import * as mock from "../../helpers/mock";

describe("Layout - Gel Button", () => {
    const sandbox = sinon.sandbox.create();

    const gamePacks = {
        MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
        GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
    };
    const gelPack = {
        key: "gel",
        url: assetPacks.gelButtonAssetPack,
    };
    const config = {
        key: "play",
        channel: buttonsChannel,
    };

    beforeEach(mock.installMockGetGmi);
    afterEach(() => {
        mock.uninstallMockGetGmi();
        sandbox.restore();
    });

    it("swaps mobile and desktop assets when resized.", () => {
        const updateCallback = sandbox.spy();
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(() => {
                const btn = new GelButton(game, 0, 0, { isMobile: true }, config);

                assert(btn.key === "gel/mobile/play.png", "is mobile asset");

                btn.resize({ isMobile: false });
                assert(btn.key === "gel/desktop/play.png", "is desktop asset");

                btn.resize({ isMobile: true });
                assert(btn.key === "gel/mobile/play.png", "is mobile asset");
            }),
        );
    });

    it("Should be centered.", () => {
        const updateCallback = sandbox.spy();
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(() => {
                const btn = new GelButton(game, 0, 0, {}, "play");
                assert(fp.isEqual(btn.anchor, new Phaser.Point(0.5, 0.5)));
            }),
        );
    });

    it("Should have a minimum hit area defined by metrics.", () => {
        const updateCallback = sinon.spy();
        const gamePacks = {
            MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
            GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
        };
        const gelPack = {
            key: "gel",
            url: assetPacks.gelButtonAssetPack,
        };

        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(() => {
                const btn = new GelButton(game, 0, 0, { hitMin: 70 }, "howToPlay");
                assert(fp.isEqual(btn.hitArea.width, 70));
                assert(fp.isEqual(btn.hitArea.height, 70));
            }),
        );
    });

    it("Should have a centred hit area.", () => {
        const updateCallback = sinon.spy();
        const gamePacks = {
            MASTER_PACK_KEY: { url: assetPacks.emptyAssetPack },
            GEL_PACK_KEY: { url: assetPacks.emptyAssetPack },
        };
        const gelPack = {
            key: "gel",
            url: assetPacks.gelButtonAssetPack,
        };

        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(() => {
                const btn = new GelButton(game, 0, 0, { hitMin: 70 }, "howToPlay");
                assert.equal(btn.hitArea.centerX, 0);
                assert.equal(btn.hitArea.centerY, 0);
            }),
        );
    });

    describe("signals", () => {
        let signalSpy;

        beforeEach(() => {
            signalSpy = sandbox.spy(signal.bus, "publish");
            GameAssets.sounds = {
                buttonClick: {
                    play: () => {},
                },
            };
        });

        afterEach(() => {
            GameAssets.sounds = {};
        });

        it("adds a signal subscription to the play button", () => {
            return runInPreload(game =>
                loadAssets(game, gamePacks, gelPack, () => {}).then(() => {
                    const button = new GelButton(game, 0, 0, true, config);
                    const expectedArgs = {
                        channel: buttonsChannel,
                        name: "play",
                        data: { game },
                    };
                    button.events.onInputUp.dispatch(button, game.input.activePointer, false);

                    assert.deepEqual(signalSpy.getCall(0).args[0], expectedArgs);
                }),
            );
        });
    });

    describe("sound", () => {
        let signalSpy;
        let soundPlayStub;

        beforeEach(() => {
            signalSpy = sandbox.spy(signal.bus, "publish");
            soundPlayStub = sandbox.stub();
            GameAssets.sounds = {
                buttonClick: {
                    play: soundPlayStub,
                },
            };
        });

        afterEach(() => {
            GameAssets.sounds = {};
        });

        it("plays the button click sound when clicked", () => {
            return runInPreload(game =>
                loadAssets(game, gamePacks, gelPack, () => {}).then(() => {
                    const button = new GelButton(game, 0, 0, true, config);
                    button.events.onInputUp.dispatch(button, game.input.activePointer, false);
                    sinon.assert.calledOnce(soundPlayStub);
                }),
            );
        });
    });
});

/**
 * Wraps a test in asynchronous Phaser setup and shutdown code, and runs it in the preload phase of the first state.
 * @param action Function to run the tests, returning a promise.
 */
function runInPreload(action) {
    let testState;
    const promisedTest = new Promise(resolve => {
        testState = new class extends Screen {
            preload() {
                resolve(action(this.game));
            }
        }();
    });

    const transitions = [
        {
            name: "loadscreen",
            state: testState,
            nextScreenName: () => "loadscreen",
        },
    ];
    return startup(transitions)
        .then(game => promisedTest.then(() => game))
        .then(game => game.destroy());
}
