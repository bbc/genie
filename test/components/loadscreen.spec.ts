import { expect } from "chai";
import * as sinon from "sinon";

import { Loadscreen } from "../../src/components/loadscreen";
import * as AssetLoader from "../../src/core/asset-loader";

describe.only("Load Screen", () => {
    let loadScreen: any;
    let mockGame: any;
    let addLookupsSpy: any;
    let assetLoaderSpy: any;
    let assetLoaderCallbackSpy: any;

    const mockNext = () => "nextFunc";
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
        addLookupsSpy = sandbox.spy();
        assetLoaderCallbackSpy = sandbox.spy();
        assetLoaderSpy = sandbox.stub(AssetLoader, "loadAssets").returns({ then: assetLoaderCallbackSpy });
        mockGame = { add: {}, state: { current: "currentState" } };

        loadScreen = new Loadscreen();
        loadScreen.layoutFactory = {
            addLookups: addLookupsSpy,
            keyLookups: {
                currentState: "gameState",
                gel: "thisIsGel",
                background: "backgroundImage",
                title: "titleImage",
            },
        };
        loadScreen.game = mockGame;
        loadScreen.nextFunc = mockNext;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("preload method", () => {
        it("calls the asset loader with correct params", () => {
            const expectedGamePacks = {
                ["MasterAssetPack"]: { url: "asset-master-pack.json" },
                ["GelAssetPack"]: { url: "gel/gel-pack.json" },
            };
            const expectedLoadscreenPack = { key: "loadscreen", url: "loader/loadscreen-pack.json" };

            const expectedUpdateLoadProgress = sandbox.spy();
            loadScreen.updateLoadProgress = expectedUpdateLoadProgress;
            loadScreen.preload();

            expect(assetLoaderSpy.args[0][0]).to.eql(mockGame);
            expect(assetLoaderSpy.args[0][1]).to.eql(expectedGamePacks);
            expect(assetLoaderSpy.args[0][2]).to.eql(expectedLoadscreenPack);

            assetLoaderSpy.args[0][3]();
            expect(expectedUpdateLoadProgress.called).to.equal(true);
        });

        it("handles the returned promise", () => {
            loadScreen.preload();
            expect(assetLoaderCallbackSpy.called).to.equal(true);
        });

        // it("adds keylookups to the layout when the promise is resolved", () => {
        //     loadScreen.context = { qaMode: { active: false } };
        //     loadScreen.preload();

        //     assetLoaderCallbackSpy.args[0][0]();

        //     expect(addLookupsSpy.args[0][0]).to.eql({
        //         currentState: "gameState",
        //         gel: "thisIsGel",
        //         background: "backgroundImage",
        //         title: "titleImage",
        //     });
        // });
    });
});
