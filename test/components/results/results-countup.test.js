/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsCountup } from "../../../src/components/results/results-countup.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

describe("ResultsCountup", () => {
    let mockScene;
    let mockCountupConfig;

    beforeEach(() => {
        mockScene = mockBaseScene();
        mockScene.scene = { key: "results" };
        mockScene.sound = { play: jest.fn() };
        mockScene.time = { addEvent: jest.fn(), delayedCall: jest.fn() };
        mockScene.transientData = { results: { stars: 10 } };
        mockCountupConfig = {
            startCount: 0,
            endCount: "<%= stars %>",
            startDelay: 1000,
            countupDuration: 1000,
            audio: {
                key: "results.coin-sfx",
                fireRate: 1,
                startPlayRate: 0.8,
                endPlayRate: 1.2,
            },
        };
    });

    afterEach(() => jest.clearAllMocks());

    test("sets text to startCount when initialised", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        expect(resultsCountup.text).toBe(mockCountupConfig.startCount.toString());
    });

    test("sets endCount properly when a string template is provided", () => {
        const resultsText = new ResultsCountup(mockScene, mockCountupConfig);
        expect(resultsText.endCount).toBe(mockScene.transientData.results.stars.toString());
    });

    test("sets fixedWidth to the final width when initialised", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        expect(resultsCountup.style.fixedWidth).toBe(resultsCountup.getFinalWidth(resultsCountup.endCount));
        expect(resultsCountup.style.fixedHeight).toBe(0);
    });

    test("starts counting up by calling delayedCall when initialised", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        expect(mockScene.time.delayedCall).toHaveBeenCalledWith(
            mockCountupConfig.startDelay,
            resultsCountup.startCountingUp,
            undefined,
            resultsCountup,
        );
    });

    test("getFinalWidth returns the size of the text while preserving text value", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        resultsCountup.getFinalWidth("test");
        expect(resultsCountup.text).toBe(mockCountupConfig.startCount.toString());
    });

    test("canPlaySound returns true when value over firerate has no remainder", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        expect(resultsCountup.canPlaySound(10)).toBe(true);
    });

    test("canPlaySound returns false when value over firerate has a remainder", () => {
        mockCountupConfig.audio.fireRate = 2;
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        expect(resultsCountup.canPlaySound(9)).toBe(false);
    });

    test("canPlaySound always returns true when firerate is below 1 - firerate defaults to 1", () => {
        mockCountupConfig.audio.fireRate = -1;
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        expect(resultsCountup.canPlaySound(1)).toBe(true);
        expect(resultsCountup.canPlaySound(2)).toBe(true);
        expect(resultsCountup.canPlaySound(3)).toBe(true);
    });

    test("startCountingUp does not add a event to the scene clock when startCount and endCount are equal", () => {
        mockScene.transientData.results.stars = 0;
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        resultsCountup.startCountingUp();
        expect(mockScene.time.addEvent).not.toHaveBeenCalled();
    });

    test("startCountingUp adds a event to the scene clock when startCount and endCount are not equal", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        resultsCountup.startCountingUp();
        expect(mockScene.time.addEvent).toHaveBeenCalledWith({
            delay: mockCountupConfig.countupDuration / 9,
            callback: resultsCountup.incrementCountByOne,
            callbackScope: resultsCountup,
            repeat: 9,
        });
    });

    test("startCountingUp adds a event to the scene clock with no delay when repeats are zero", () => {
        mockScene.transientData.results.stars = 1;
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        resultsCountup.startCountingUp();
        expect(mockScene.time.addEvent).toHaveBeenCalledWith({
            delay: undefined,
            callback: resultsCountup.incrementCountByOne,
            callbackScope: resultsCountup,
            repeat: 0,
        });
    });

    test("incrementCountByOne increases text value by 1", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        resultsCountup.incrementCountByOne();
        expect(resultsCountup.text).toBe("1");
    });

    test("incrementCountByOne plays audio when canPlaySound is true", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        resultsCountup.incrementCountByOne();
        expect(mockScene.sound.play).toHaveBeenCalledWith(mockCountupConfig.audio.key, { rate: 0.8 + (1 / 10) * 0.4 });
    });

    test("incrementCountByOne does not play audio when it is not defined in config", () => {
        delete mockCountupConfig.audio;
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        resultsCountup.incrementCountByOne();
        expect(mockScene.sound.play).not.toHaveBeenCalled();
        expect(resultsCountup.text).toBe("1");
    });

    test("incrementCountByOne defaults starting and ending play rate to 1", () => {
        delete mockCountupConfig.audio.startPlayRate;
        delete mockCountupConfig.audio.endPlayRate;
        const resultsCountup = new ResultsCountup(mockScene, mockCountupConfig);
        resultsCountup.incrementCountByOne();
        expect(mockScene.sound.play).toHaveBeenCalledWith(mockCountupConfig.audio.key, { rate: 1 });
    });
});
