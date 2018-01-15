import "../../../src/lib/phaser";
import { Startup } from "../../../src/lib/examples/core-state";
import { expect } from "chai";

describe("Boolean function", () => {
    it("should return true when false is given", () => {
        const state = new Startup();
        const result = state.negateBoolean(true);
        expect(result).to.equal(false);
    });
    it("should return false when true is given", () => {
        const state = new Startup();
        const result = state.negateBoolean(false);
        expect(result).to.equal(true);
    });
});
