import { assert, expect } from "chai";
import * as sinon from "sinon";
import { startup } from "../../src/core/startup";
import * as Sequencer from "../../src/core/sequencer";
import * as mock from "../helpers/mock";

describe("Startup", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(mock.installMockGetGmi);
    afterEach(mock.uninstallMockGetGmi);

    describe("Phaser loading", () => {
        it("should resolve a promise when Phaser is fully initialised", () => {
            return startup([mock.screenDef()]).then(game => {
                expect(game.isBooted).to.equal(true);
                assert.isOk(game.stage);
                game.destroy();
            });
        });

        it("should create a canvas element within the designated parent", () => {
            return startup([mock.screenDef()]).then(game => {
                expect(mock.getGameHolderDiv().children[0].tagName).to.equal("CANVAS");
                game.destroy();
            });
        });

        it("should add the aria-hidden flag to the canvas element", () => {
            return startup([mock.screenDef()]).then(game => {
                const canvas = mock.getGameHolderDiv().getElementsByTagName("canvas")[0];
                expect(canvas.getAttribute("aria-hidden")).to.equal("true");
                game.destroy();
            });
        });

        it("should configure the Phaser base url to be the GMI gameDir", () => {
            mock.installMockGetGmi({ gameDir: "my/game/dir/" });
            return startup([mock.screenDef()]).then(game => {
                expect(game.load.baseURL).to.equal("my/game/dir/");
                game.destroy();
            });
        });

        it("should configure the Phaser loader path to be the config directory", () => {
            mock.installMockGetGmi({ embedVars: { configPath: "my/config/file.json" } });
            return startup([mock.screenDef()]).then(game => {
                expect(game.load.path).to.equal("my/config/");
                game.destroy();
            });
        });

        xit("should display error messages in the browser", () => {
            // Manual test: Any generation of exceptions or even ErrorEvents causes
            // the test to fail anyway :-(
        });
    });

    describe("Context", () => {
        it("should configure the Phaser loader path to be the config directory", () => {
            mock.installMockGetGmi({ embedVars: { configPath: "my/config/file.json" } });
            return startup([mock.screenDef()]).then(game => {
                expect(game.load.path).to.equal("my/config/");
                game.destroy();
            });
        });
    });

    describe("Renderer", () => {
        it("should set transparent to true", () => {
            mock.installMockGetGmi({ embedVars: { configPath: "my/config/file.json" } });
            return startup([mock.screenDef()]).then(game => {
                expect(game.renderer.transparent).to.equal(true);
                game.destroy();
            });
        });
    });

    it("adds a config key to context", () => {
        mock.installMockGetGmi({
            embedVars: {
                configPath: "my/config/file.json",
            },
        });

        const sequencerCreate = sandbox.stub(Sequencer, "create");

        return startup([mock.screenDef()]).then(game => {
            const context = sequencerCreate.args[0][1];

            assert(context.config !== undefined, "config exists on context object");

            game.destroy();
        });
    });
});
