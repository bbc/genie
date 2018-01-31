import { expect } from "chai";
import { PromiseTrigger } from "src/core/promise-utils";
import { startup } from "src/core/startup";
import { installMockGetGmi, uninstallMockGetGmi } from "test/helpers/mock";

const TEST_DIV_ID = "test-div";

describe("Startup", () => {
    beforeEach(installMockGetGmi);
    afterEach(uninstallMockGetGmi);

    it("should create a canvas element", done => {
        startup();
        setTimeout(() => {
            expect(getElementOrThrow(TEST_DIV_ID).children[0].tagName).to.equal("CANVAS");
            done();
        }, 1000);
    });

    function getElementOrThrow(id: string): HTMLElement {
        const e = document.getElementById(id);
        if (e) {
            return e;
        } else {
            throw Error("Didn't find " + id);
        }
    }
});
