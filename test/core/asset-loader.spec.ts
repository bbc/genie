import "babel-polyfill";
import { expect } from "chai";
import * as sinon from "sinon";
import { loadAssets, Pack, PackList, ScreenMap } from "src/core/asset-loader";
import { startup } from "src/core/startup";
import "src/lib/phaser";
import { assetPackUrl } from "test/helpers/asset-packs";
import { installMockGetGmi, uninstallMockGetGmi } from "test/helpers/mock";

describe("empty", () => {
    beforeEach(installMockGetGmi);
    afterEach(uninstallMockGetGmi);
    xit("callback", () => {
        const updateCallback = sinon.spy();
        return startup()
            .then(game => {
                const gamePacks: PackList = {
                    MASTER_PACK_KEY: { url: assetPackUrl },
                    GEL_PACK_KEY: { url: assetPackUrl },
                };
                const loadscreenPack: Pack = {
                    key: "loadscreen",
                    url: assetPackUrl,
                };
                return runInPreload(game, () => loadAssets(game, gamePacks, loadscreenPack, updateCallback));
            })
            .then((value: ScreenMap) => {
                sinon.assert.called(updateCallback);
            });
    });

    it("Works with promises", () => {
        return Promise.resolve(true).then(value => {
            expect(value).to.equal(true);
        });
    });
});

function runInPreload<T>(game: Phaser.Game, action: () => Promise<T>): Promise<T> {
    let doResolve: (value: Promise<T>) => void;
    game.state.add(
        "load",
        class State extends Phaser.State {
            constructor() {
                super();
            }
            public preload() {
                doResolve(action());
            }
        },
    );
    game.state.start("load");
    return new Promise<T>(resolve => {
        doResolve = resolve;
    });
}
