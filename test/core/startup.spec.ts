import { expect } from "chai";
import { PromiseTrigger } from "src/core/promise-utils";
import { startup } from "src/core/startup";
import { installMockGetGmi, uninstallMockGetGmi, getElementOrThrow } from "test/helpers/mock";

const TEST_DIV_ID = "test-div";

describe("Startup", () => {
    beforeEach(installMockGetGmi);
    afterEach(uninstallMockGetGmi);

    it("should create a canvas element", () => {
        return startup([]).then(() => {
            expect(getElementOrThrow(TEST_DIV_ID).children.length).to.equal(1);
        });
    });
});
