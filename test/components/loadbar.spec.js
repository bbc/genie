/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as LoadBar from "../../src/components/loadbar";

describe("Load Bar", () => {
    let mockPhaserGroup;
    let mockPhaserRectangle;
    let mockBarBg;
    let mockBarFill;
    let mockGame;

    beforeEach(() => {
        mockPhaserGroup = { addChild: jest.fn() };
        mockPhaserRectangle = { crop: jest.fn() };
        global.Phaser.Group = jest.fn().mockImplementation(() => mockPhaserGroup);
        global.Phaser.Rectangle = jest.fn().mockImplementation(() => mockPhaserRectangle);

        mockBarBg = {
            anchor: { add: jest.fn() },
            crop: jest.fn(),
        };

        mockBarFill = {
            width: 300,
            height: 20,
            anchor: { add: jest.fn() },
            crop: jest.fn(),
        };

        mockGame = {
            add: { image: jest.fn().mockImplementation((x, y, imageName) => imageName) },
        };
    });

    afterEach(() => jest.clearAllMocks());

    test("creates a new Phaser game with correct params", () => {
        LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
        expect(Phaser.Group).toHaveBeenCalledWith(mockGame);
    });

    describe("Images", () => {
        test("adds a loading bar background image with co-cordinates", () => {
            LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
            expect(mockGame.add.image).toHaveBeenCalledWith(0, 0, mockBarBg);
            expect(mockBarBg.anchor.add).toHaveBeenCalledWith(0.5, 0.5);
        });

        test("adds the loading bar background to the phaser group", () => {
            LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
            expect(mockPhaserGroup.addChild).toHaveBeenCalledWith(mockBarBg);
        });

        test("adds a loading bar fill image with co-cordinates", () => {
            LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
            expect(mockGame.add.image).toHaveBeenCalledWith(0, 0, mockBarFill);
            expect(mockBarFill.anchor.add).toHaveBeenCalledWith(0, 0.5);
        });

        test("adds width to the loading bar fill image", () => {
            LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
            expect(mockBarFill.x).toBe(-150);
        });

        test("makes a phaser rectangle for the fill image", () => {
            LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
            expect(global.Phaser.Rectangle).toHaveBeenCalledWith(0, 0, 0, mockBarFill.height);
            expect(mockBarFill.crop).toHaveBeenCalledWith(mockPhaserRectangle, false);
        });

        test("adds the loading bar to the Phaser group", () => {
            LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
            expect(mockPhaserGroup.addChild).toHaveBeenCalledWith(mockBarFill);
        });
    });

    describe("Fill percentage", () => {
        test("can get the fill percentage", () => {
            LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
            expect(mockPhaserGroup.fillPercent).toBe(0);
        });

        test("can set the fill percentage", () => {
            const percentage = 25;
            LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
            mockPhaserGroup.fillPercent = percentage;
            expect(mockPhaserGroup.fillPercent).toBe(25);
        });

        test("setting the percentage updates the bar fill image", () => {
            const percentage = 35;
            LoadBar.createLoadBar(mockGame, mockBarBg, mockBarFill);
            mockPhaserGroup.fillPercent = percentage;
            expect(mockPhaserRectangle.width).toBe(105);
            expect(mockBarFill.crop).toHaveBeenCalledWith(mockPhaserRectangle);
        });
    });
});
