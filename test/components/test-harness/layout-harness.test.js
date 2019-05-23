/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createTestHarnessDisplay } from "../../../src/components/test-harness/layout-harness";

describe("test harness layout", () => {
    const qKeyCode = 81;

    let mockGame;
    let mockContext;
    let mockScene;
    let onKeyUpSpy;
    let addKeyStub;

    beforeEach(() => {
        onKeyUpSpy = jest.fn();
        addKeyStub = jest.fn().mockImplementation(argument => {
            if (argument === qKeyCode) {
                return { onUp: { add: onKeyUpSpy } };
            }
        });
        mockGame = {
            add: { group: jest.fn() },
            input: {
                keyboard: {
                    addKey: addKeyStub,
                },
            },
        };
        mockScene = {
            addToBackground: jest.fn(),
            getSize: jest.fn(() => ({
                width: 300,
                height: 300,
                stageHeightPx: 400,
            })),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("QA mode is active and layout is not currently displayed", () => {
        beforeEach(() => {
            global.window.__qaMode = {};
            mockContext = {
                qaMode: { active: true },
                scaler: {
                    getSize: () => ({
                        width: 800,
                        height: 600,
                        scale: 1,
                        stageHeightPx: 600,
                    }),
                },
            };
            createTestHarnessDisplay(mockGame, mockContext, mockScene);
        });

        describe("create function is called", () => {
            test("creates two new groups (background and foreground) to store all test harness graphics", () => {
                expect(mockGame.add.group).toHaveBeenCalledTimes(2);
            });

            test("adds keyboard input and assigns it to a listener", () => {
                expect(onKeyUpSpy).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("QA mode is NOT active", () => {
        beforeEach(() => {
            global.window.__qaMode = undefined;
            mockContext = {
                qaMode: {
                    active: false,
                },
            };
            createTestHarnessDisplay(mockGame, mockContext, mockScene);
        });

        test("does nothing", () => {
            expect(mockGame.add.group).not.toHaveBeenCalled();
            expect(onKeyUpSpy).not.toHaveBeenCalled();
        });
    });
});
