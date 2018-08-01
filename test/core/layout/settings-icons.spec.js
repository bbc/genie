import { assert } from "chai";
import * as sinon from "sinon";

import * as settingsIcons from "../../../src/core/layout/settings-icons.js";
import * as signal from "../../../src/core/signal-bus.js";
import * as gmiModule from "../../../src/core/gmi/gmi.js";

describe("Layout - Settings Icons", () => {
    const sandbox = sinon.createSandbox();
    let fakeGroup;
    let fakeGmi;
    let unsubscribeSpy;

    beforeEach(() => {
        unsubscribeSpy = sandbox.spy();
        fakeGmi = {
            getAllSettings: sandbox.stub().returns({ motion: "motion-data", audio: "audio-data" }),
        };
        fakeGroup = {
            addButton: sandbox.stub(),
            removeButton: sandbox.spy(),
            reset: sandbox.spy(),
            length: 1,
        };
        sandbox.stub(signal.bus, "publish");
        sandbox.stub(signal.bus, "subscribe").returns({ unsubscribe: unsubscribeSpy });
        sandbox.replace(gmiModule, "gmi", fakeGmi);
        window.getGMI = sandbox.stub().returns(fakeGmi);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Signal Publishing", () => {
        beforeEach(() => settingsIcons.create(fakeGroup, []));

        it("publishes signals for motion", () => {
            const motionParams = signal.bus.publish.getCall(0).args;
            assert.equal(motionParams[0].channel, "genie-settings");
            assert.equal(motionParams[0].name, "motion");
            assert.equal(motionParams[0].data, "motion-data");
        });

        it("publishes signals for audio", () => {
            const audioParams = signal.bus.publish.getCall(1).args;
            assert.equal(audioParams[0].channel, "genie-settings");
            assert.equal(audioParams[0].name, "audio");
            assert.equal(audioParams[0].data, "audio-data");
        });
    });

    describe("Signal Unsubscribing", () => {
        beforeEach(() => {
            const createdSettingsIcons = settingsIcons.create(fakeGroup, []);
            createdSettingsIcons.unsubscribe();
        });

        it("unsubscribes from each button signal", () => {
            sandbox.assert.calledTwice(unsubscribeSpy);
        });
    });

    describe("Motion FX Button Subscription", () => {
        it("has a signal subscription with correct name and channel", () => {
            settingsIcons.create(fakeGroup, ["audio"]);
            sandbox.assert.calledOnce(signal.bus.subscribe);
            const actualParams = signal.bus.subscribe.getCall(0).args;
            assert.equal(actualParams[0].channel, "genie-settings");
            assert.equal(actualParams[0].name, "motion");
        });

        describe("Motion FX callback creates button icon", () => {
            it("adds the button icon to the group when the signal callback is fired", () => {
                settingsIcons.create(fakeGroup, ["audio"]);
                const iconExists = false;
                const callback = signal.bus.subscribe.getCall(0).args[0].callback;
                callback(iconExists);

                sandbox.assert.calledOnce(fakeGroup.addButton);
                const actualParams = fakeGroup.addButton.getCall(0).args;
                assert.deepEqual(actualParams[0], {
                    title: "FX Off",
                    key: "fx-off-icon",
                    id: "fx-off",
                    signalName: "motion",
                    icon: true,
                });
                assert.equal(actualParams[1], 0);
            });

            it("does not add the button icon to the very end of the group when there are are other buttons", () => {
                fakeGroup.length = 4;
                settingsIcons.create(fakeGroup, ["audio"]);
                const iconExists = false;
                const callback = signal.bus.subscribe.getCall(0).args[0].callback;
                callback(iconExists);

                const expectedPosition = 0;
                assert.equal(fakeGroup.addButton.getCall(0).args[1], expectedPosition);
            });

            it("resets the group when the signal callback is fired", () => {
                settingsIcons.create(fakeGroup, ["audio"]);
                const iconExists = false;
                const callback = signal.bus.subscribe.getCall(0).args[0].callback;
                callback(iconExists);

                sandbox.assert.calledOnce(fakeGroup.reset);
            });
        });

        describe("Motion FX callback removes button icon", () => {
            beforeEach(() => {
                settingsIcons.create(fakeGroup, ["audio"]);
                const iconExists = true;
                fakeGroup.addButton.returns("motion-fx-icon");
                const callback = signal.bus.subscribe.getCall(0).args[0].callback;
                callback(false); // creates button icon
                callback(iconExists);
            });

            it("removes the button icon from the group when the signal callback is fired", () => {
                sandbox.assert.calledOnce(fakeGroup.removeButton);
                const actualParams = fakeGroup.removeButton.getCall(0).args;
                assert.deepEqual(actualParams[0], "motion-fx-icon");
            });

            it("resets the group when the signal callback is fired again", () => {
                sandbox.assert.calledTwice(fakeGroup.reset);
            });
        });

        describe("Motion FX callback does not alter group", () => {
            let callback;

            beforeEach(() => {
                settingsIcons.create(fakeGroup, ["audio"]);
                fakeGroup.addButton.returns("motion-fx-icon");
                callback = signal.bus.subscribe.getCall(0).args[0].callback;
            });

            it("does not add/remove button icon when callback is passed true but icon does not exist", () => {
                callback(true);
                sandbox.assert.notCalled(fakeGroup.addButton);
                sandbox.assert.notCalled(fakeGroup.removeButton);
                sandbox.assert.calledOnce(fakeGroup.reset);
            });

            it("does not add/remove button icon when icon exists but calback is passed false", () => {
                callback(false); // creates icon
                callback(false);
                sandbox.assert.calledOnce(fakeGroup.addButton);
                sandbox.assert.notCalled(fakeGroup.removeButton);
                sandbox.assert.calledTwice(fakeGroup.reset);
            });
        });
    });

    describe("Audio Button Subscription", () => {
        it("gets a signal subscription when not already included in the buttons list", () => {
            settingsIcons.create(fakeGroup, []);
            sandbox.assert.calledTwice(signal.bus.subscribe);
        });

        it("has a signal subscription with correct name and channel", () => {
            settingsIcons.create(fakeGroup, []);
            const actualParams = signal.bus.subscribe.getCall(1).args;
            assert.equal(actualParams[0].channel, "genie-settings");
            assert.equal(actualParams[0].name, "audio");
        });

        describe("Audio callback creates button icon", () => {
            it("adds the button icon to the group when the signal callback is fired", () => {
                settingsIcons.create(fakeGroup, []);
                const iconExists = false;
                const callback = signal.bus.subscribe.getCall(1).args[0].callback;
                callback(iconExists);

                sandbox.assert.calledOnce(fakeGroup.addButton);
                const actualParams = fakeGroup.addButton.getCall(0).args;
                assert.deepEqual(actualParams[0], {
                    title: "Audio Off",
                    key: "audio-off-icon",
                    id: "audio-off",
                    signalName: "audio",
                    icon: true,
                });
                assert.equal(actualParams[1], 0);
            });

            it("adds the button icon to the very end of the group when there are are other buttons", () => {
                fakeGroup.length = 4;
                settingsIcons.create(fakeGroup, []);
                const iconExists = false;
                const callback = signal.bus.subscribe.getCall(1).args[0].callback;
                callback(iconExists);

                const expectedPosition = 3;
                assert.equal(fakeGroup.addButton.getCall(0).args[1], expectedPosition);
            });

            it("resets the group when the signal callback is fired", () => {
                settingsIcons.create(fakeGroup, []);
                const iconExists = false;
                const callback = signal.bus.subscribe.getCall(1).args[0].callback;
                callback(iconExists);

                sandbox.assert.calledOnce(fakeGroup.reset);
            });
        });

        describe("Audio callback removes button icon", () => {
            beforeEach(() => {
                settingsIcons.create(fakeGroup, []);
                const iconExists = true;
                fakeGroup.addButton.returns("audio-icon");
                const callback = signal.bus.subscribe.getCall(1).args[0].callback;
                callback(false); // creates button icon
                callback(iconExists);
            });

            it("removes the button icon from the group when the signal callback is fired", () => {
                sandbox.assert.calledOnce(fakeGroup.removeButton);
                const actualParams = fakeGroup.removeButton.getCall(0).args;
                assert.deepEqual(actualParams[0], "audio-icon");
            });

            it("resets the group when the signal callback is fired again", () => {
                sandbox.assert.calledTwice(fakeGroup.reset);
            });
        });

        describe("Audio callback does not alter group", () => {
            let callback;

            beforeEach(() => {
                settingsIcons.create(fakeGroup, []);
                fakeGroup.addButton.returns("audio-icon");
                callback = signal.bus.subscribe.getCall(1).args[0].callback;
            });

            it("does not add/remove button icon when callback is passed true but icon does not exist", () => {
                callback(true);
                sandbox.assert.notCalled(fakeGroup.addButton);
                sandbox.assert.notCalled(fakeGroup.removeButton);
                sandbox.assert.calledOnce(fakeGroup.reset);
            });

            it("does not add/remove button icon when icon exists but calback is passed false", () => {
                callback(false); // creates icon
                callback(false);
                sandbox.assert.calledOnce(fakeGroup.addButton);
                sandbox.assert.notCalled(fakeGroup.removeButton);
                sandbox.assert.calledTwice(fakeGroup.reset);
            });
        });
    });
});
