import { expect } from "chai";
import * as sinon from "sinon";

import { LayoutFactory } from "../../../src/core/layout/factory";

describe("Layout Factory", () => {
    let mockGame: any;

    beforeEach(() => {
        mockGame = {
            start: sinon.spy(),
            add: { group: sinon.spy(() => ({ addChild: sinon.spy() })) },
            renderer: { resolution: 800 },
            scale: {
                setGameSize: sinon.spy(),
                scaleMode: sinon.spy(),
                onSizeChange: { add: sinon.spy() },
                getParentBounds: sinon.spy(),
            },
        };
        LayoutFactory(mockGame, document.createElement("div"));
    });

    it("Should add 'gelBackground', 'gelGroup' and 'foreground' layers to the phaser game", () => {
        expect(mockGame.add.group.calledWith(undefined, "gelBackground")).to.eql(true);
        expect(mockGame.add.group.calledWith(undefined, "gelGroup")).to.eql(true);
        expect(mockGame.add.group.calledWith(undefined, "foreground")).to.eql(true);
        expect(mockGame.add.group.callCount).to.eql(3);
    });

    it("Should add a callback to the scaler.onSizechange method", () => {
        //expect(mockGame.scale.setGameSize.calledWith(undefined, "gelBackground")).to.eql(true);
        expect(mockGame.scale.setGameSize.callCount).to.eql(1);
    });
});
