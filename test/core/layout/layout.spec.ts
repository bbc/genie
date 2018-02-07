import { expect } from "chai";
import * as sinon from "sinon";
import * as mock from "test/helpers/mock";

import "phaser-ce";

import { Layout } from "src/core/layout/layout";

describe.only("Layout", () => {
    let mockGame: any;
    let mockScaler: any;
    let mockAccessibilityManager: any;
    let mockKeyLookup: any;

    beforeEach(() => {
        mock.installMockGetGmi();

        // mockGame = {
        //     // add: sinon.spy(),
        //     start: sinon.spy(),
        //     add: { group: sinon.spy(() => ({ addChild: sinon.spy() })) },
        //     renderer: { resolution: 800 },
        //     scale: {
        //         setGameSize: sinon.spy(),
        //         scaleMode: sinon.spy(),
        //         onSizeChange: { add: sinon.spy() },
        //         getParentBounds: sinon.spy(),
        //     },
        // };

        mockGame = sinon.stub(Phaser);

        mockGame.scale = { setGameSize: sinon.spy() };

        mockGame.add = { group: sinon.spy(() => ({ addChild: sinon.spy() })) },

        // mockGame = {
        //     // add: sinon.spy(),
        //     start: sinon.spy(),
        //     add: { group: sinon.spy(() => ({ addChild: sinon.spy() })) },
        //     renderer: { resolution: 800 },
        //     scale: {
        //         setGameSize: sinon.spy(),
        //         scaleMode: sinon.spy(),
        //         onSizeChange: { add: sinon.spy() },
        //         getParentBounds: sinon.spy(),
        //     },
        // };

        mockScaler = { getSize: sinon.spy(() => ({ width: 200, height: 200 })) };
        mockAccessibilityManager = {};
        mockKeyLookup = sinon.spy();

        //layout = new Layout(mockGame, mockScaler, mockAccessibilityManager, mockKeyLookup, ["exit"]);
    });

    afterEach(mock.uninstallMockGetGmi);

    it("should create 9 GEL groups", done => {
        //layout.create("exit");

        //layout.removeAll();
        //expect(mockGame.scale.setGameSize.calledWith(undefined, "gelBackground")).to.eql(true);

        //console.log("GROUPS: " + mockGame.scale.setGameSize.callCount);

        //expect(mockGame.scale.setGameSize.callCount).to.eql(1);
        done();
    });
});
