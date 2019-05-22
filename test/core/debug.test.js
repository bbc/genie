/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as debug from "../../src/core/debug.js";

describe("debug", () => {
    test("returns the correct methods", () => {
        expect(debug.add).toBeDefined();
        expect(debug.render).toBeDefined();
        expect(debug.toggle).toBeDefined();
        expect(debug.clear).toBeDefined();
    });

    test("debugs the correct number of Phaser.Sprite objects on render", () => {
        const mockGame = {
            debug: {
                body: jest.fn(),
            },
        };
        const testSprite = new global.Phaser.Sprite(new global.Phaser.Game(), 0, 0, "", 0);

        debug.clear();
        debug.enable();
        debug.add(testSprite);
        debug.render(mockGame);

        expect(mockGame.debug.body).toHaveBeenCalled();
    });

    test("debugs the correct number of Phaser.Group objects on render", () => {
        const mockGame = {
            debug: {
                geom: jest.fn(),
            },
        };

        const testGroup = new global.Phaser.Group(new global.Phaser.Game());

        debug.clear();
        debug.enable();
        debug.add(testGroup);
        debug.render(mockGame);

        expect(mockGame.debug.geom).toHaveBeenCalled();
    });

    test("toggles enabled state to true", () => {
        const mockGame = {
            debug: {
                body: jest.fn(),
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
        expect(mockGame.debug.body).toHaveBeenCalled();
    });

    test("toggles enabled state to false and resets debug sprite", () => {
        const mockGame = {
            debug: {
                body: jest.fn(),
                reset: jest.fn(),
            },
        };
        debug.clear();
        debug.enable();
        debug.toggle(mockGame);
        debug.add({});
        debug.render(mockGame);

        expect(mockGame.debug.body).not.toHaveBeenCalled();
        expect(mockGame.debug.reset).toHaveBeenCalled();
    });

    test("clears the debug list", () => {
        const mockGame = {
            debug: {
                body: jest.fn(),
            },
        };
        debug.enable();
        debug.add({});
        debug.clear();
        debug.render(mockGame);

        expect(mockGame.debug.body).not.toHaveBeenCalled();
    });
});
