import { expect } from "chai";
import * as sinon from "sinon";
import * as Scaler from "src/core/scaler";
import "src/lib/phaser";

describe("Scaler", () => {
    let mockGame: any;

    beforeEach(() => {
        mockGame = {
            scale: {
                setGameSize: sinon.spy(),
                scaleMode: sinon.spy(),
                onSizeChange: { add: sinon.spy()},
            },
        };

    });

    it("Should set the scalemode be an exact fit on create", () => {
        Scaler.create(600, mockGame);
        expect(mockGame.scale.scaleMode).to.eql(Phaser.ScaleManager.EXACT_FIT);
    });
    
    it("Should call the games onSizeChange add function once", () => {
        Scaler.create(600, mockGame);
        window.dispatchEvent(new Event("resize"));
        expect(mockGame.scale.onSizeChange.add.callCount).to.eql(1);
    });
});
