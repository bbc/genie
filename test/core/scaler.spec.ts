import { expect } from "chai";
import * as sinon from "sinon";
import * as Scaler from "../../src/core/scaler";
import "../../src/lib/phaser";

describe("Scaler", () => {
    let mockGame: any;

    beforeEach(() => {
        mockGame = {
            scale: {
                setGameSize: sinon.spy(),
                scaleMode: sinon.spy(),
                onSizeChange: { add: sinon.spy() },
                getParentBounds: sinon.spy(() => {
                    return { width: 800, height: 600 };
                }),
            },
        };
    });

    it("Should set the scalemode be an exact fit on create", () => {
        Scaler.create(600, mockGame);
        expect(mockGame.scale.scaleMode).to.eql(Phaser.ScaleManager.EXACT_FIT);
    });

    it("Should call the games onSizeChange add function once", () => {
        Scaler.create(600, mockGame);
        expect(mockGame.scale.onSizeChange.add.callCount).to.eql(1);
    });

    it("Should return the correct height, width, scale and stageHeight when getSize is called", () => {
        const scaler = Scaler.create(600, mockGame);
        const size = scaler.getSize();
        expect(size.width).to.eql(800);
        expect(size.height).to.eql(600);
        expect(size.scale).to.eql(1);
        expect(size.stageHeightPx).to.eql(600);
    });
});
