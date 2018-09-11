/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";

import * as debug from "../../src/core/debug.js";

describe("debug", () => {
    it("returns the correct methods", () => {
        assert.exists(debug.add);
        assert.exists(debug.render);
        assert.exists(debug.toggle);
        assert.exists(debug.clear);
    });

    it("debugs the correct number of Phaser.Sprite objects on render", () => {
        const spy = sinon.spy();

        const mockGame = {
            debug: {
                body: spy,
            },
        };

        const testSprite = new Phaser.Sprite(new Phaser.Game(), 0, 0, "", 0);

        debug.clear();
        debug.enable();
        debug.add(testSprite);
        debug.render(mockGame);

        assert(spy.calledOnce);
    });

    it("debugs the correct number of Phaser.Group objects on render", () => {
        const spy = sinon.spy();

        const mockGame = {
            debug: {
                geom: spy,
            },
        };

        const testGroup = new Phaser.Group(new Phaser.Game());

        debug.clear();
        debug.enable();
        debug.add(testGroup);
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

        const testSprite = new Phaser.Sprite(new Phaser.Game(), 0, 0, "", 0);

        //toggle enabled
        debug.clear();
        debug.enable(mockGame, false);
        debug.toggle(mockGame);
        debug.add(testSprite);
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
