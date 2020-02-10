/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { ResultsCountup } from "../../../src/components/results/results-countup.js";
import { mockBaseScene } from "../../mock/mock-scene.js";

describe("ResultsCountup", () => {
    let mockScene;
    let mockConfig;

    beforeEach(() => {
        mockScene = mockBaseScene();
        mockScene.scene = { key: "results" };
        mockScene.events = { on: jest.fn(), once: jest.fn() };
        mockScene.sound = { play: jest.fn() };
        mockScene.time = { addEvent: jest.fn(), delayedCall: jest.fn() };
        mockScene.transientData = { results: { stars: 10 } };
        mockConfig = {
            startCount: 0,
            endCount: "<%= stars %>",
            startDelay: 1000,
            countupDuration: 1000,
            audio: {
                key: "results.coin-sfx",
                singleTicksRange: 5,
                ticksPerSecond: 10,
                startPlayRate: 0.8,
                endPlayRate: 1.2,
            },
        };
    });

    afterEach(() => jest.clearAllMocks());

    test("sets text to startCount when initialised", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        expect(resultsCountup.text).toBe(mockConfig.startCount.toString());
    });

    test("sets endCount properly when a string template is provided", () => {
        const resultsText = new ResultsCountup(mockScene, mockConfig);
        expect(resultsText.endCount).toBe(mockScene.transientData.results.stars.toString());
    });

    test("sets fixedWidth to the final width when initialised", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        expect(resultsCountup.style.fixedWidth).toBe(resultsCountup.getFinalWidth(resultsCountup.endCount));
        expect(resultsCountup.style.fixedHeight).toBe(0);
    });

    test("getFinalWidth returns the size of the text while preserving text value", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.getFinalWidth("test");
        expect(resultsCountup.text).toBe(mockConfig.startCount.toString());
    });

    test("canPlaySound returns true when singleTicksRange is false and ticks need firing", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.shouldSingleTick = false;
        resultsCountup.numberOfTicks = 0;
        expect(resultsCountup.canPlaySound(1, 30, 1000)).toBe(true);
    });

    test("canPlaySound returns false when singleTicksRange is false and ticks do not need firing", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.shouldSingleTick = false;
        resultsCountup.numberOfTicks = Infinity;
        expect(resultsCountup.canPlaySound(0, 30, 2000)).toBe(false);
    });

    test("canPlaySound returns true when singleTicksRange is true and the text has been updated", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.shouldSingleTick = true;
        resultsCountup.text = "21";
        resultsCountup.previousText = "20";
        expect(resultsCountup.canPlaySound(1, 30, 1000)).toBe(true);
    });

    test("canPlaySound returns true when ticksPerSecond is undefined and the text has been updated", () => {
        delete mockConfig.audio.ticksPerSecond;
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.text = "21";
        resultsCountup.previousText = "20";
        expect(resultsCountup.canPlaySound(1, undefined, 1000)).toBe(true);
    });

    test("canPlaySound returns false when ticksPerSecond is undefined and the text has not been updated", () => {
        delete mockConfig.audio.ticksPerSecond;
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.text = "21";
        resultsCountup.previousText = "21";
        expect(resultsCountup.canPlaySound(1, undefined, 1000)).toBe(false);
    });

    test("canPlaySound returns false when singleTicksRange is true and the text has not been updated", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.shouldSingleTick = true;
        resultsCountup.text = "21";
        resultsCountup.previousText = "21";
        expect(resultsCountup.canPlaySound(1, 30, 1000)).toBe(false);
    });

    test("incrementCount does not play audio when it is not defined in config", () => {
        delete mockConfig.audio;
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.incrementCount(0, mockConfig);
        expect(mockScene.sound.play).not.toHaveBeenCalled();
    });

    test("incrementCount plays audio when canPlaySound is true", () => {
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.canPlaySound = () => true;
        resultsCountup.incrementCount(0, mockConfig);
        expect(mockScene.sound.play).toHaveBeenCalledWith(mockConfig.audio.key, { rate: 0.8 });
    });

    test("incrementCount defaults starting and ending play rate to 1", () => {
        delete mockConfig.audio.startPlayRate;
        delete mockConfig.audio.endPlayRate;
        const resultsCountup = new ResultsCountup(mockScene, mockConfig);
        resultsCountup.canPlaySound = () => true;
        resultsCountup.incrementCount(0, mockConfig);
        expect(mockScene.sound.play).toHaveBeenCalledWith(mockConfig.audio.key, { rate: 1 });
    });
});
