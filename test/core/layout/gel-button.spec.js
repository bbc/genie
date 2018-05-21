import { assert } from "chai";
import * as sinon from "sinon";

import * as LayoutFactory from "../../../src/core/layout/factory";
import * as Layout from "../../../src/core/layout/layout";
import * as Scaler from "../../../src/core/scaler";

describe.only("Layout - GelButton", () => {
    const sandbox = sinon.sandbox.create();

    let button, game, x, y, metrics, config;

    beforeEach(() => {
        game = sandbox.stub();
        x = 50;
        y = 100;
        metrics = {
            hitMin: 50,
            isMobile: false,
        };
        config = {
            key: "play",
        };
        button = new GelButton(game, x, y, metrics, config);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("#setHitArea", () => {
        it("", () => {
            console.log(button);
        });
    });

    //describe("resize");
});
