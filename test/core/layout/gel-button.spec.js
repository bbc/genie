import fp from "../../../src/lib/lodash/fp/fp.js";

import { assert } from "chai";
import { loadAssets } from "../../../src/core/asset-loader";
import { Screen } from "../../../src/core/screen";
import { startup } from "../../../src/core/startup";
import { assetPacks } from "../../helpers/asset-packs";
import * as mock from "../../helpers/mock";
import * as signal from "../../../src/core/signal-bus.js";

import { GelButton } from "../../../src/core/layout/gel-button";

import * as sinon from "sinon";

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
        channel: "gel-buttons",
    };

    beforeEach(mock.installMockGetGmi);
    afterEach(mock.uninstallMockGetGmi);

    it("swaps mobile and desktop assets when resized.", () => {
        const updateCallback = sandbox.spy();
        return runInPreload(game =>
            loadAssets(game, gamePacks, gelPack, updateCallback).then(() => {
                const btn = new GelButton(game, 0, 0, true, config);

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
                const btn = new GelButton(game, 0, 0, true, "play");
                assert(fp.isEqual(btn.anchor, new Phaser.Point(0.5, 0.5)));
            }),
        );
    });

    describe("signals", () => {
        let signalSpy;
        let nextSpy;

        beforeEach(() => {
            signalSpy = sandbox.spy(signal.bus, "publish");
        });

        it("adds a signal subscription to the play button", () => {
            return runInPreload(game =>
                loadAssets(game, gamePacks, gelPack, () => {}).then(() => {
                    const button = new GelButton(game, 0, 0, true, config);
                    const expectedArgs = {
                        channel: "gel-buttons",
                        name: "play",
                        data: { game },
                    };
                    button.events.onInputUp.dispatch(button, game.input.activePointer, false);

                    assert.deepEqual(signalSpy.getCall(0).args[0], expectedArgs);
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
