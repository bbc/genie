import { expect } from "chai";
import * as sinon from "sinon";
import * as Scaler from "../../src/core/scaler";

describe("Scaler", () => {
    let mockGame;

    beforeEach(() => {
        mockGame = {
            scale: {
                setGameSize: sinon.spy(),
                scaleMode: sinon.spy(),
                setResizeCallback: sinon.spy(),
                onSizeChange: { add: sinon.spy() },
                getParentBounds: sinon.spy(() => {
                    return { width: 800, height: 600 };
                }),
            },
        };
    });

    it("Should set the scalemode to SHOW_ALL on create", () => {
        Scaler.create(600, mockGame);
        expect(mockGame.scale.scaleMode).to.eql(Phaser.ScaleManager.SHOW_ALL);
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
        expect(size.stageHeight).to.eql(600);
    });
});
