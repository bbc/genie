import { assert, expect } from "chai";
import * as sinon from "sinon";

import * as debug from "../../src/core/debug.js";

describe("debug", () => {
    it("returns the correct methods", () => {
        assert.exists(debug.add);
        assert.exists(debug.render);
        assert.exists(debug.toggle);
        assert.exists(debug.clear);
    });

    it("debugs the correct number of items on render", () => {
        const spy = sinon.spy();

        const mockGame = {
            debug: {
                body: spy,
            },
        };

        debug.clear();
        debug.enable();
        debug.add({});
        debug.render(mockGame);

        assert(spy.calledOnce);
    });

    it("toggles enabled state to true", () => {
        let spy = sinon.spy();

        const mockGame = {
            debug: {
                body: spy,
                reset: () => {},
            },
        };

        //toggle enabled
        debug.clear();
        debug.enable(mockGame, false);
        debug.toggle(mockGame);
        debug.add({});
        debug.render(mockGame);
        assert(spy.calledOnce);
    });

    it("toggles enabled state to false and resets debug sprite", () => {
        let spy = sinon.spy();
        let resetSpy = sinon.spy();

        const mockGame = {
            debug: {
                body: spy,
                reset: resetSpy,
            },
        };

        spy = sinon.spy();
        debug.clear();
        debug.enable();
        debug.toggle(mockGame);
        debug.add({});
        debug.render(mockGame);

        assert(spy.notCalled);
        assert(resetSpy.calledOnce);
    });

    it("clears the debug list", () => {
        const spy = sinon.spy();

        const mockGame = {
            debug: {
                body: spy,
            },
        };

        debug.enable();
        debug.add({});
        debug.clear();
        debug.render(mockGame);

        assert(spy.notCalled);
    });
});
