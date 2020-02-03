/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as Rows from "../../../src/core/layout/rows.js";
import { ResultsRow } from "../../../src/components/results/results-row.js";

jest.mock("../../../src/components/results/results-row.js");

describe("Rows", () => {
    let mockScene;
    let mockRowsConfig;
    let mockArea;
    let getMockArea;

    beforeEach(() => {
        mockScene = {
            layout: {
                addCustomGroup: jest.fn(),
            },
            add: {
                tween: jest.fn(),
            },
            sound: {
                play: jest.fn(),
            },
            time: {
                addEvent: jest.fn(),
            },
        };
        mockRowsConfig = [{}, {}, {}];
        mockArea = {
            height: 6,
            width: 10,
            x: 20,
            y: 36,
        };
        getMockArea = () => mockArea;
    });

    test("RowTypes.Results enum points to ResultsRow", () => {
        expect(Rows.RowType.Results).toBe(ResultsRow);
    });

    test("passing in RowTypes.Results returns a ResultsRow container", () => {
        const rows = Rows.create(mockScene, getMockArea, mockRowsConfig, Rows.RowType.Results);
        expect(rows.containers.length).toBe(mockRowsConfig.length);
        rows.containers.forEach(container => expect(container).toBeInstanceOf(ResultsRow));
    });

    test("creates the correct number of containers", () => {
        mockRowsConfig = [{}, {}];
        const rows = Rows.create(mockScene, getMockArea, mockRowsConfig, Rows.RowType.Results);
        expect(rows.containers.length).toBe(mockRowsConfig.length);
    });

    test("adds each container to the layout", () => {
        const rows = Rows.create(mockScene, getMockArea, mockRowsConfig, Rows.RowType.Results);
        expect(rows.containers.length).toBe(mockRowsConfig.length);
        rows.containers.forEach((container, index) =>
            expect(mockScene.layout.addCustomGroup).toHaveBeenCalledWith(`row-${index}`, container),
        );
    });

    test("getRectForRow(0) returns a function which returns the correct rectangle for the top row", () => {
        const rows = Rows.create(mockScene, getMockArea, mockRowsConfig, Rows.RowType.Results);
        expect(rows.getRectForRow(0)()).toEqual(
            new Phaser.Geom.Rectangle(mockArea.x, mockArea.y, mockArea.width, mockArea.height / mockRowsConfig.length),
        );
    });

    test("getRectForRow(rowsConfig.length) returns a function which returns the correct rectangle for the bottom row", () => {
        const rows = Rows.create(mockScene, getMockArea, mockRowsConfig, Rows.RowType.Results);
        expect(rows.getRectForRow(mockRowsConfig.length)()).toEqual(
            new Phaser.Geom.Rectangle(
                mockArea.x,
                mockArea.y + mockArea.height,
                mockArea.width,
                mockArea.height / mockRowsConfig.length,
            ),
        );
    });

    test("rowTransitions sets up tweens as specified in config", () => {
        const mockTweenConfig = {
            duration: 1000,
            alpha: { from: 0, to: 1 },
        };
        mockRowsConfig = [
            {
                transition: mockTweenConfig,
            },
        ];
        const rows = Rows.create(mockScene, getMockArea, mockRowsConfig, (scene, config) => ({ rowConfig: config }));
        rows.rowTransitions();
        expect(mockScene.add.tween).toHaveBeenCalledWith(expect.objectContaining(mockTweenConfig));
    });

    test("rowTransitions sets up a time event for audio when specified in config", () => {
        mockRowsConfig = [
            {
                audio: { key: "mockAudioKey", delay: 1000 },
            },
        ];
        const rows = Rows.create(mockScene, getMockArea, mockRowsConfig, (scene, config) => ({ rowConfig: config }));
        rows.rowTransitions();

        expect(mockScene.time.addEvent.mock.calls[0][0]).toEqual(
            expect.objectContaining({ delay: 1000, callback: expect.any(Function) }),
        );
    });

    test("rowTransitions callback triggers audio", () => {
        mockRowsConfig = [
            {
                audio: { key: "mockAudioKey", delay: 1000 },
            },
        ];
        const rows = Rows.create(mockScene, getMockArea, mockRowsConfig, (scene, config) => ({ rowConfig: config }));
        rows.rowTransitions();

        const callback = mockScene.time.addEvent.mock.calls[0][0].callback;
        callback();
        expect(mockScene.sound.play).toHaveBeenCalledWith("mockAudioKey");
    });

    test("rowTransitions does not set up audio when absent from config", () => {
        const rows = Rows.create(mockScene, getMockArea, mockRowsConfig, (scene, config) => ({ rowConfig: config }));
        rows.rowTransitions();
        expect(mockScene.time.addEvent).not.toHaveBeenCalled();
    });
});
