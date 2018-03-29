import { assert } from "chai";
import * as sinon from "sinon";

import * as SignalBus from "../../src/core/signal-bus";

describe("Signal Bus", () => {
    it("Should fire the correct callbacks when a signal is published", () => {
        const bus = SignalBus.create();

        const callback = sinon.spy();

        bus.subscribe({ callback, name: "testSignal1" });

        bus.publish({ name: "testSignal1" });
        bus.publish({ name: "testSignal1", data: 12345 });
        bus.publish({ name: "testSignal1", data: { exampleData: "abcdef" } });

        assert(callback.callCount === 3);
    });

    it("Should remove signals correctly", () => {
        const bus = SignalBus.create();
        const callback = sinon.spy();

        bus.subscribe({ callback, name: "testSignal1" });
        bus.remove("testSignal1");
        bus.publish({ name: "testSignal1" });
        assert(callback.callCount === 0, "signal should be removed");
    });

    it("Should pass data from publisher to subscribers", () => {
        const bus = SignalBus.create();
        let received;
        let data;

        bus.subscribe({ callback: newData => (received = newData), name: "testSignal" });

        data = { a: 1, b: 2, c: 3 };
        bus.publish({ name: "testSignal", data });
        assert(data === received);

        data = { BBC: [1, 2, 3, 4, 5] };
        bus.publish({ name: "testSignal", data });
        assert(data === received);
    });

    describe("#clearAll", () => {
        it("clears all signals active on the bus", () => {
            const bus = SignalBus.create();
            const callback = sinon.spy();

            bus.subscribe({ callback, name: "testSignal1" });
            bus.subscribe({ callback, name: "testSignal2" });
            bus.subscribe({ callback, name: "testSignal3" });

            bus.clearAll();

            bus.publish({ name: "testSignal1" });
            bus.publish({ name: "testSignal2" });
            bus.publish({ name: "testSignal3" });

            assert(callback.callCount === 0, "all signals should be removed");
        });
    });
});
