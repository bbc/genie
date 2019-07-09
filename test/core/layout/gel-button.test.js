/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

/*
    We have been unable to test this file as it extends Phaser.Button.
    There appears to be no way to mock a global class that is extended
    The problem being that the global Phaser is evaluated at import before any mocks have been set up.

 */

//global.Phaser.Button = function() {}

// import { GelButton } from "../../../src/core/layout/gel-button";
//import * as settingsModule from '../../../src/core/settings.js'

describe("Layout - Button Factory", () => {
    // let mockGame;

    beforeEach(() => {
        //jest.mock(global.Phaser.Button)
        //jest.spyOn(Phaser, "Button").mockImplementation(function() {});
        //Phaser = {
        //    Button: () => "hi",
        //    Matrix: () => "ho",
        //}
        //jest.spyOn(Phaser, "Button").mockImplementation(function() {})
        //jest.spyOn(Phaser, "Game").mockImplementation(() => mockGame);
        //mockGame = { canvas: () => {}, mockGame: "game" };
    });

    afterEach(() => jest.clearAllMocks());

    describe("create method", () => {
        test("returns correct methods", () => {
            //const config = {
            //    id: "expectedId",
            //    ariaLabel: "expectedAriaLabel",
            //    key: "test",
            //    action: () => {},
            //};
            //Phaser.Button = function() {}
            //GelButton.prototype = {};
            //GelButton.prototype.constructor = jest.fn();
            //jest.mock(GelButton.prototype, () => {
            //    return function() {};
            //})
            //const mockSettings = {getAllSettings: () => ({ audio: false })}
            //Object.defineProperty(global.Phaser, "Button", {
            //    get: jest.fn(),
            //});
            //global.Phaser.Button = function() {}
            //const x = new Phaser.Button( 0, 0, '');
            //const y = new GelButton(mockGame, 0, 0, false, config);
            //expect(buttonFactory.createButton).toBeDefined();
        });
    });
});
