import { expect } from "chai";
import { startup } from "src/core/startup";
import { installMockGetGmi, uninstallMockGetGmi } from "test/helpers/mock";

const TEST_DIV_ID = "test-div";

describe("Startup", () => {
    beforeEach(installMockGetGmi);
    afterEach(uninstallMockGetGmi);

    it("should create a canvas element", done => {
        startup();
        setTimeout(() => {
            expect(getElementOrThrow(TEST_DIV_ID).children.length).to.equal(1);
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
