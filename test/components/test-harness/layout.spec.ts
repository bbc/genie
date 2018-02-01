import { expect } from "chai";
import * as sinon from "sinon";
import { testHarnessDisplay, StubbedGlobalContextState } from "src/components/test-harness/layout";
import "src/lib/phaser";

describe('test harness layout', () => {
    let qaModeActive: boolean;
    let testHarnessLayoutDisplayed: boolean;
    let testHarness: { create: () => void };
    let mockGame: any;
    let context: StubbedGlobalContextState;
    let sandbox: sinon.SinonSandbox;
    let QKeyCode: number;
    let onKeyUpSpy: any;
    let addKeyStub: any;

    before(() => {
        context = {
            qaMode: {
                active: qaModeActive,
                testHarnessLayoutDisplayed
            }
        };
    });

    describe('QA mode is active and layout is not currently displayed', () => {
        before(() => {
            qaModeActive = true;
            testHarnessLayoutDisplayed = false;
            QKeyCode = 81;
            sandbox = sinon.sandbox.create();
        });

        describe('create function is called', () => {
            beforeEach(() => {
                onKeyUpSpy = sandbox.spy();
                addKeyStub = sandbox.stub();
                addKeyStub.withArgs(QKeyCode).returns({
                    onUp: {
                        add: onKeyUpSpy
                    }
                });
                
                mockGame = {
                    add: {
                        group: sandbox.spy()
                    },
                    input: {
                        keyboard: {
                            addKey: addKeyStub
                        }
                    }
                };
                testHarness = testHarnessDisplay(mockGame, context);
                testHarness.create();
            });

            afterEach(() => {
                sandbox.restore();
            });

            it('creates new group to store all test harness graphics', () => {
                sinon.assert.calledOnce(mockGame.add.group);
            });

            it('adds keyboard input and assigns it to a listener', () => {
                sinon.assert.calledOnce(onKeyUpSpy)
            });
        });
    });
});
