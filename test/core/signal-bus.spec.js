/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as SignalBus from "../../src/core/signal-bus";

describe("Signal Bus", () => {
    afterEach(() => jest.clearAllMocks());

    it("fires the correct callbacks when a signal on a channel is published", () => {
        const bus = SignalBus.create();
        const callback = jest.fn();

        bus.subscribe({ callback, channel: "testChannel", name: "testSignal1" });

        bus.publish({ channel: "testChannel", name: "testSignal1" });
        bus.publish({ channel: "testChannel", name: "testSignal1", data: 12345 });
        bus.publish({ channel: "testChannel", name: "testSignal1", data: { exampleData: "abcdef" } });

        expect(callback).toHaveBeenCalledTimes(3);
    });

    it("removes signals from a channel correctly", () => {
        const bus = SignalBus.create();
        const callback = jest.fn();

        bus.subscribe({ callback, channel: "testChannel2", name: "testSignal1" });
        bus.removeChannel("testChannel2");
        bus.publish({ channel: "testChannel2", name: "testSignal1" });
        expect(callback).not.toHaveBeenCalled();
    });

    it("passes data from publisher to subscribers", () => {
        const bus = SignalBus.create();
        const expectedData1 = { a: 1, b: 2, c: 3 };
        const expectedData2 = { BBC: [1, 2, 3, 4, 5] };
        const callbackSpy = jest.fn();

        bus.subscribe({ callback: callbackSpy, channel: "someChannel", name: "someSignal" });

        bus.publish({ channel: "someChannel", name: "someSignal", data: expectedData1 });
        expect(callbackSpy.mock.calls[0][0]).toEqual(expectedData1);

        bus.publish({ channel: "someChannel", name: "someSignal", data: expectedData2 });
        expect(callbackSpy.mock.calls[1][0]).toEqual(expectedData2);
    });

    it("removes all signals only on a given channel", () => {
        const bus = SignalBus.create();
        const channelCallback = jest.fn();
        const otherChannelCallback = jest.fn();

        bus.subscribe({ callback: channelCallback, channel: "channelName", name: "testSignal1" });
        bus.subscribe({ callback: otherChannelCallback, channel: "otherChannelName", name: "testSignal2" });
        bus.subscribe({ callback: channelCallback, channel: "channelName", name: "testSignal3" });

        bus.removeChannel("channelName");

        bus.publish({ channel: "channelName", name: "testSignal1" });
        bus.publish({ channel: "otherChannelName", name: "testSignal2" });
        bus.publish({ channel: "channelName", name: "testSignal3" });

        expect(channelCallback).not.toHaveBeenCalled();
        expect(otherChannelCallback).toHaveBeenCalledTimes(1);
    });
});
