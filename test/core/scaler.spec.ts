/// <reference path="../../src/lib/gmi.d.ts" />

import { expect } from "chai";

import { scaler } from "src/core/scaler";

const TEST_DIV_ID = "test-div";

describe("Startup", () => {
    beforeEach(() => {
        document.body.appendChild(document.createElement("div")).id = TEST_DIV_ID;
        (window as any).getGMI = () => {
            return {
                gameContainerId: TEST_DIV_ID,
                embedVars: { configPath: "" },
            } as Gmi;
        };
    });

    afterEach(() => {
        document.body.removeChild(getElementOrThrow(TEST_DIV_ID));
    });

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
