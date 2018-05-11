import { expect } from "chai";
import * as sinon from "sinon";

import * as LoadBar from "../../src/components/loadbar";
import * as AssetLoader from "../../src/core/asset-loader";
import { GameAssets } from "../../src/core/game-assets.js";

// TODO: Unit test this
describe.skip("Load Bar", () => {
    describe("createLoadBar", () => {
        it("creates and returns a load bar", () => {
            LoadBar.createLoadBar();
        });
    });
});
