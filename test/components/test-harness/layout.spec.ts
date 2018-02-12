import "src/lib/phaser";

import { expect } from "chai";
import * as sinon from "sinon";
import { createTestHarnessDisplay } from "src/components/test-harness/layout";

describe("test harness layout", () => {
    let mockGame: any;
    let mockContext: any;
    let sandbox: sinon.SinonSandbox;
    const qKeyCode: number = 81;
    let onKeyUpSpy: any;
    let addKeyStub: any;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    beforeEach(() => {
        onKeyUpSpy = sandbox.spy();
        addKeyStub = sandbox.stub();
        addKeyStub.withArgs(qKeyCode).returns({
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
        createTestHarnessDisplay(mockGame, mockContext);
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
