import { assert } from "chai";
import * as sinon from "sinon";
import { startup } from "../../src/core/startup.js";
import * as gmiModule from "../../src/core/gmi.js";

describe("#startup", () => {
    const sandbox = sinon.createSandbox();

    let PhaserGame, containerDiv;

    beforeEach(() => {
        const mockGmi = {
            gameContainerId: "some-id",
        };
        containerDiv = sandbox.stub();

        sandbox
            .stub(document, "getElementById")
            .withArgs(mockGmi.gameContainerId)
            .returns(containerDiv);

        sandbox.replace(gmiModule, "gmi", mockGmi);
        PhaserGame = sandbox.stub(Phaser, "Game");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("creates a new Phaser game", () => {
        startup();

        sinon.assert.calledWithNew(PhaserGame);
    });

    it("creates a new Phaser game with correct config", () => {
        startup();

        const expectedConfig = {
            width: 1400,
            height: 600,
            renderer: 0,
            antialias: true,
            multiTexture: false,
            parent: containerDiv,
            state: sandbox.stub(),
            transparent: true,
        };

        const actualConfig = PhaserGame.getCall(0).args[0];

        assert.equal(actualConfig.width, expectedConfig.width);
        assert.equal(actualConfig.height, expectedConfig.height);
        assert.equal(actualConfig.renderer, expectedConfig.renderer);
        assert.equal(actualConfig.antialias, expectedConfig.antialias);
        assert.equal(actualConfig.multiTexture, expectedConfig.multiTexture);
        assert.equal(actualConfig.parent, expectedConfig.parent);
        assert.equal(actualConfig.transparent, expectedConfig.transparent);
    });
});
