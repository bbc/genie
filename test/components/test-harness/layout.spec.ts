import { expect } from "chai";
import * as sinon from "sinon";
import { testHarnessDisplay } from "src/components/test-harness/layout";
import "src/lib/phaser";

describe("test harness layout", () => {
    let qaModeActive: boolean;
    let testHarnessLayoutDisplayed: boolean;
    let testHarness: { create: () => void };
    let mockGame: any;
    let mockContext: any;
    let sandbox: sinon.SinonSandbox;
    let QKeyCode: number;
    let onKeyUpSpy: any;
    let addKeyStub: any;

    before(() => {
        QKeyCode = 81;
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        onKeyUpSpy = sandbox.spy();
        addKeyStub = sandbox.stub();
        addKeyStub.withArgs(QKeyCode).returns({
            onUp: {
                add: onKeyUpSpy,
            },
        });
        mockGame = {
            add: {
                group: sandbox.spy(),
            },
            input: {
                keyboard: {
                    addKey: addKeyStub,
                },
            },
        };
        testHarness = testHarnessDisplay(mockGame, mockContext);
        testHarness.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("QA mode is active and layout is not currently displayed", () => {
        before(() => {
            mockContext = {
                qaMode: {
                    active: true,
                },
                scaler: {
                    getSize: () => {
                        return {
                            width: 800,
                            height: 600,
                            scale: 1,
                            stageHeightPx: 600,
                        };
                    },
                },
            };
        });

        describe("create function is called", () => {
            it("creates new group to store all test harness graphics", () => {
                sinon.assert.calledOnce(mockGame.add.group);
            });

            it("adds keyboard input and assigns it to a listener", () => {
                sinon.assert.calledOnce(onKeyUpSpy);
            });
        });
    });

    describe("QA mode is NOT active", () => {
        before(() => {
            mockContext = {
                qaMode: {
                    active: false,
                },
            };
        });

        it("does nothing", () => {
            sinon.assert.notCalled(mockGame.add.group);
            sinon.assert.notCalled(onKeyUpSpy);
        });
    });
});
