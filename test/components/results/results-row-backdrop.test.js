/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createRowBackdrops, scaleRowBackdrops } from "../../../src/components/results/results-row-backdrop.js";

describe("ResultsRow - Row Backdrops", () => {
    let mockScene;
    let mockImage;
    let mockContainers;
    let mockBackdropConfig;

    beforeEach(() => {
        mockImage = { setAlpha: jest.fn(() => mockImage) };
        mockScene = { add: { image: jest.fn(() => mockImage) } };
        mockBackdropConfig = { key: "test", alpha: 0.5, offsetX: 0, offsetY: 0 };
        mockContainers = [{ rowConfig: { backdrop: mockBackdropConfig }, x: 10, y: 20 }];
    });

    afterEach(() => jest.clearAllMocks());

    test("sets up backdrop images as specified in config", () => {
        createRowBackdrops(mockScene, mockContainers);
        expect(mockScene.add.image).toHaveBeenCalledWith(
            mockContainers[0].x + mockBackdropConfig.offsetX,
            mockContainers[0].y + mockBackdropConfig.offsetY,
            mockBackdropConfig.key,
        );
    });

    test("sets up backdrop images as specified in config when no offsets are provided", () => {
        delete mockBackdropConfig.offsetX;
        delete mockBackdropConfig.offsetY;
        createRowBackdrops(mockScene, mockContainers);
        expect(mockScene.add.image).toHaveBeenCalledWith(
            mockContainers[0].x,
            mockContainers[0].y,
            mockBackdropConfig.key,
        );
    });

    test("does not setup a backdrop image if not specified in config", () => {
        delete mockContainers[0].rowConfig.backdrop;
        createRowBackdrops(mockScene, mockContainers);
        expect(mockScene.add.image).not.toHaveBeenCalled();
    });

    test("sets the alpha on the backdrop image", () => {
        createRowBackdrops(mockScene, mockContainers);
        expect(mockImage.setAlpha).toHaveBeenCalledWith(mockBackdropConfig.alpha);
    });

    test("sets the alpha on the backdrop image to 1 if not specified in config", () => {
        delete mockBackdropConfig.alpha;
        createRowBackdrops(mockScene, mockContainers);
        expect(mockImage.setAlpha).toHaveBeenCalledWith(1);
    });

    test("return value is an array of specified backdrop images", () => {
        expect(createRowBackdrops(mockScene, mockContainers)).toEqual([mockImage]);
    });

    describe("ScaleRowBackdrops", () => {
        let mockBackdrops;

        beforeEach(() => {
            mockBackdrops = [{ x: 10, y: 20 }];
        });

        test("does not error if the container does not have a backdrop", () => {
            delete mockContainers[0].rowConfig.backdrop;
            expect(() => scaleRowBackdrops(mockBackdrops, mockContainers)).not.toThrow();
        });

        test("correctly scales backdrops if the container is moved and does not have an offset", () => {
            delete mockBackdropConfig.offsetX;
            delete mockBackdropConfig.offsetY;
            mockContainers[0].x = 20;
            mockContainers[0].y = 40;
            scaleRowBackdrops(mockBackdrops, mockContainers);
            expect(mockBackdrops[0]).toEqual({ x: 20, y: 40 });
        });

        test("correctly scales backdrops if the container is moved and has an offset", () => {
            mockBackdropConfig.offsetX = 25;
            mockBackdropConfig.offsetY = 50;
            mockContainers[0].x = 20;
            mockContainers[0].y = 40;
            scaleRowBackdrops(mockBackdrops, mockContainers);
            expect(mockBackdrops[0]).toEqual({ x: 45, y: 90 });
        });
    });
});
