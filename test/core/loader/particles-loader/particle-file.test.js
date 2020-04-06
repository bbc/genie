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
