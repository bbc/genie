import "../../../src/lib/phaser";

import * as sinon from "sinon";
import { createTestHarnessDisplay } from "../../../src/components/test-harness/layout-harness";

describe("test harness layout", () => {
    const qKeyCode = 81;

    let mockGame;
    let mockContext;
    let mockLayoutFactory;
    let sandbox;
    let onKeyUpSpy;
    let addKeyStub;

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
        mockLayoutFactory = {
            addToBackground: sandbox.spy(),
            getSize: sandbox.stub().returns({
                width: 300,
                height: 300,
                stageHeightPx: 400,
            }),
        };
        createTestHarnessDisplay(mockGame, mockContext, mockLayoutFactory);
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
            it("creates two new groups (background and foreground) to store all test harness graphics", () => {
                sinon.assert.calledTwice(mockGame.add.group);
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
