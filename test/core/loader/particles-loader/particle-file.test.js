/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ParticlesFile } from "../../../../src/core/loader/particles-loader/particles-file.js";

describe("Particles File", () => {
    let mockLoader;
    let mockFileConfig;

    beforeEach(() => {
        mockLoader = {
            nextFile: jest.fn(),
            emit: jest.fn(),
            cacheManager: {
                json: {},
            },
        };
        mockFileConfig = {
            type: "particles",
            key: "testConfig",
            url: "test/test.json5",
        };
    });
    afterEach(() => jest.clearAllMocks());

    describe("onProcess method", () => {
        test("calls the the JSON parser", () => {
            global.JSON.parse = jest.fn();
            const file = new ParticlesFile(mockLoader, mockFileConfig);
            const testJSON = "{}";

            file.xhrLoader = {
                responseText: testJSON,
            };
            file.onProcessComplete = jest.fn();
            file.onProcess();
            expect(global.JSON.parse).toHaveBeenCalledWith(testJSON);
        });

        describe("Phaser Geometry Objects", () => {
            test.only("translates Phaser Reactangles in the JSON into Geometry objects", () => {
                Phaser.Reactangle = jest.fn();
                const expectedRectangle = {
                    height: 0,
                    type: 5,
                    width: 0,
                    x: { "0": 200, "1": 350, "2": 400, "3": 200 },
                    y: 0,
                };
                const mockData = {
                    x: 200,
                    y: 400,
                    deathZone: {
                        type: "onEnter",
                        source: {
                            phaserGeom: true,
                            type: "rectangle",
                            properties: [200, 350, 400, 200],
                        },
                    },
                };

                global.JSON.parse = jest.fn(() => mockData);
                const file = new ParticlesFile(mockLoader, mockFileConfig);
                const testJSON = "{}";

                file.xhrLoader = { responseText: testJSON };
                file.onProcessComplete = jest.fn();
                file.onProcess();
                expect(mockData.deathZone.source).toEqual(expectedRectangle);
                expect(Phaser.Reactangle).toHaveBeenCalledWith({...mockData.deathZone.source.properties });
            });

            test("translates Phaser Circles in the JSON into Geometry objects", () => {

            });

            test("translates Phaser Ellipses in the JSON into Geometry objects", () => {

            });

            test("translates Phaser Lines in the JSON into Geometry objects", () => {

            });

            test("translates Phaser Points in the JSON into Geometry objects", () => {

            });

            test("translates Phaser Polygons in the JSON into Geometry objects", () => {

            });

            test("translates Phaser Triangles in the JSON into Geometry objects", () => {

            });

            test("translates Phaser Circles in the JSON into Geometry objects", () => {

            });

            test("throws an error when the type of geometry object does not exist", () => {

            });


        });

        test("calls onProcessComplete", () => {
            const file = new ParticlesFile(mockLoader, mockFileConfig);
            const testJSON = "{}";

            file.xhrLoader = {
                responseText: testJSON,
            };
            file.onProcessComplete = jest.fn();
            file.onProcess();
            expect(file.onProcessComplete).toHaveBeenCalled();
        });
    });
});
