import { expect } from "chai";
import { PromiseTrigger } from "src/core/promise-utils";
import { startup } from "src/core/startup";
import * as mock from "test/helpers/mock";

describe("Startup", () => {
    beforeEach(mock.installMockGetGmi);
    afterEach(mock.uninstallMockGetGmi);

    //TODO Re-enable this once chrome-headless is available. Currently fails on Phantom due to Promise shim race condition
    xit("should resolve a promise when Phaser is fully initialised", () => {
        return startup([mock.screenDef()]).then(game => {
            expect(game.isBooted).to.equal(true);
            expect(game.stage).to.be.ok;
        });
    });

    it("should create a canvas element within the designated parent", () => {
        return startup([mock.screenDef()]).then(() => {
            expect(mock.getGameHolderDiv().children[0].tagName).to.equal("CANVAS");
        });
    });

    it("should configure the Phaser base url to be the GMI gameDir", () => {
        mock.installMockGetGmi({ gameDir: "my/game/dir/" });
        return startup([mock.screenDef()]).then(game => {
            expect(game.load.baseURL).to.equal("my/game/dir/");
        });
    });

    it("should configure the Phaser loader path to be the config directory", () => {
        mock.installMockGetGmi({ embedVars: { configPath: "my/config/file.json" } });
        return startup([mock.screenDef()]).then(game => {
            expect(game.load.path).to.equal("my/config/");
        });
    });

    xit("should display error messages in the browser", () => {
        // Manual test: Any generation of exceptions or even ErrorEvents causes
        // the test to fail anyway :-(
    });
});
