import { assert } from "chai";
import * as sinon from "sinon";

import * as SignalBus from "../../src/core/signal-bus";

describe("Signal Bus", () => {
    let sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("fires the correct callbacks when a signal on a channel is published", () => {
        const bus = SignalBus.create();
        const callback = sandbox.spy();

        bus.subscribe({ callback, channel: "testChannel", name: "testSignal1" });

        bus.publish({ channel: "testChannel", name: "testSignal1" });
        bus.publish({ channel: "testChannel", name: "testSignal1", data: 12345 });
        bus.publish({ channel: "testChannel", name: "testSignal1", data: { exampleData: "abcdef" } });

        assert(callback.callCount === 3);
    });

    it("removes signals from a channel correctly", () => {
        const bus = SignalBus.create();
        const callback = sandbox.spy();

        bus.subscribe({ callback, channel: "testChannel2", name: "testSignal1" });
        bus.removeChannel("testChannel2");
        bus.publish({ channel: "testChannel2", name: "testSignal1" });
        assert(callback.callCount === 0, "channel should be removed");
    });

    it("passes data from publisher to subscribers", () => {
        const bus = SignalBus.create();
        const expectedData1 = { a: 1, b: 2, c: 3 };
        const expectedData2 = { BBC: [1, 2, 3, 4, 5] };
        const callbackSpy = sandbox.spy();

        bus.subscribe({ callback: callbackSpy, channel: "someChannel", name: "someSignal" });

        bus.publish({ channel: "someChannel", name: "someSignal", data: expectedData1 });
        assert.deepEqual(callbackSpy.getCall(0).args[0], expectedData1);

        bus.publish({ channel: "someChannel", name: "someSignal", data: expectedData2 });
        assert.deepEqual(callbackSpy.getCall(1).args[0], expectedData2);
    });

    it("removes all signals only on a given channel", () => {
        const bus = SignalBus.create();
        const channelCallback = sandbox.spy();
        const otherChannelCallback = sandbox.spy();

        bus.subscribe({ callback: channelCallback, channel: "channelName", name: "testSignal1" });
        bus.subscribe({ callback: otherChannelCallback, channel: "otherChannelName", name: "testSignal2" });
        bus.subscribe({ callback: channelCallback, channel: "channelName", name: "testSignal3" });

        bus.removeChannel("channelName");

        bus.publish({ channel: "channelName", name: "testSignal1" });
        bus.publish({ channel: "otherChannelName", name: "testSignal2" });
        bus.publish({ channel: "channelName", name: "testSignal3" });

        assert(channelCallback.callCount === 0, "all signals should be removed from channel");
        assert(otherChannelCallback.callCount === 1, "no signals should be removed from other channel");
    });
});
