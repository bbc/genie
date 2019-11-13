/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as SignalBus from "../../src/core/signal-bus";

describe("Signal Bus", () => {
    let mockEventEmitter;

    const createMockEventEmitter = () => {
        mockEventEmitter = {
            on: jest.fn(),
            off: jest.fn(),
            emit: jest.fn(),
            destroy: jest.fn(),
        };
        return jest.spyOn(Phaser.Events, "EventEmitter").mockImplementation(() => mockEventEmitter);
    };

    afterEach(() => {
        mockEventEmitter = undefined;
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("can subscribe to individual signals", () => {
        createMockEventEmitter();
        const callback = jest.fn();
        const bus = SignalBus.create();
        bus.subscribe({ callback, channel: "someChannel", name: "someSignal" });
        expect(mockEventEmitter.on).toHaveBeenCalledWith("someSignal", callback);
    });

    test("can unsubscribe from individual signals", () => {
        createMockEventEmitter();
        const callback = jest.fn();
        const bus = SignalBus.create();
        const signal = bus.subscribe({ callback, channel: "someChannel", name: "someSignal" });
        signal.unsubscribe();
        expect(mockEventEmitter.off).toHaveBeenCalledWith("someSignal", callback);
    });

    test("fires the correct callbacks when a signal on a channel is published", () => {
        const bus = SignalBus.create();
        const callback = jest.fn();

        bus.subscribe({ callback, channel: "testChannel", name: "testSignal1" });

        bus.publish({ channel: "testChannel", name: "testSignal1" });
        bus.publish({ channel: "testChannel", name: "testSignal1", data: 12345 });
        bus.publish({ channel: "testChannel", name: "testSignal1", data: { exampleData: "abcdef" } });

        expect(callback).toHaveBeenCalledTimes(3);
    });

    test("passes data from publisher to subscribers", () => {
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

    describe("removeChannel", () => {
        test("removes the channel when removeChannel is called", () => {
            const bus = SignalBus.create();
            const callback = jest.fn();

            bus.subscribe({ callback, channel: "testChannel2", name: "testSignal1" });
            bus.removeChannel("testChannel2");
            bus.publish({ channel: "testChannel2", name: "testSignal1" });
            expect(callback).not.toHaveBeenCalled();
        });

        test("destroys the channel when removeChannel is called", () => {
            createMockEventEmitter();
            const bus = SignalBus.create();
            const callback = jest.fn();

            bus.subscribe({ callback, channel: "testChannel2", name: "testSignal1" });
            bus.removeChannel("testChannel2");
            expect(mockEventEmitter.destroy).toHaveBeenCalled();
        });

        test("does not error attempting to remove channel that does not exist", () => {
            const bus = SignalBus.create();
            expect(() => {
                bus.removeChannel("testChannel2");
            }).not.toThrow();
        });
    });

    describe("removeSubscription", () => {
        test("does not error attempting to remove a subscriptio that does not exist", () => {
            const bus = SignalBus.create();
            expect(() => {
                bus.removeSubscription({ channel: "testChannel", name: "testName", callback: "textCb" });
            }).not.toThrow();
        });
    });
});
