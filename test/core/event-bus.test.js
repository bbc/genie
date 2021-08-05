/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as EventBus from "../../src/core/event-bus";

describe("Event Bus", () => {
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

	test("can subscribe to individual events", () => {
		createMockEventEmitter();
		const callback = jest.fn();
		const bus = EventBus.create();
		bus.subscribe({ callback, channel: "someChannel", name: "someEvent" });
		expect(mockEventEmitter.on).toHaveBeenCalledWith("someEvent", callback);
	});

	test("can unsubscribe from individual events", () => {
		createMockEventEmitter();
		const callback = jest.fn();
		const bus = EventBus.create();
		const event = bus.subscribe({ callback, channel: "someChannel", name: "someEvent" });
		event.unsubscribe();
		expect(mockEventEmitter.off).toHaveBeenCalledWith("someEvent", callback);
	});

	test("fires the correct callbacks when a event on a channel is published", () => {
		const bus = EventBus.create();
		const callback = jest.fn();

		bus.subscribe({ callback, channel: "testChannel", name: "testEvent1" });

		bus.publish({ channel: "testChannel", name: "testEvent1" });
		bus.publish({ channel: "testChannel", name: "testEvent1", data: 12345 });
		bus.publish({ channel: "testChannel", name: "testEvent1", data: { exampleData: "abcdef" } });

		expect(callback).toHaveBeenCalledTimes(3);
	});

	test("passes data from publisher to subscribers", () => {
		const bus = EventBus.create();
		const expectedData1 = { a: 1, b: 2, c: 3 };
		const expectedData2 = { BBC: [1, 2, 3, 4, 5] };
		const callbackSpy = jest.fn();

		bus.subscribe({ callback: callbackSpy, channel: "someChannel", name: "someEvent" });

		bus.publish({ channel: "someChannel", name: "someEvent", data: expectedData1 });
		expect(callbackSpy.mock.calls[0][0]).toEqual(expectedData1);

		bus.publish({ channel: "someChannel", name: "someEvent", data: expectedData2 });
		expect(callbackSpy.mock.calls[1][0]).toEqual(expectedData2);
	});

	describe("removeChannel", () => {
		test("removes the channel when removeChannel is called", () => {
			const bus = EventBus.create();
			const callback = jest.fn();

			bus.subscribe({ callback, channel: "testChannel2", name: "testEvent1" });
			bus.removeChannel("testChannel2");
			bus.publish({ channel: "testChannel2", name: "testEvent1" });
			expect(callback).not.toHaveBeenCalled();
		});

		test("destroys the channel when removeChannel is called", () => {
			createMockEventEmitter();
			const bus = EventBus.create();
			const callback = jest.fn();

			bus.subscribe({ callback, channel: "testChannel2", name: "testEvent1" });
			bus.removeChannel("testChannel2");
			expect(mockEventEmitter.destroy).toHaveBeenCalled();
		});

		test("does not error attempting to remove channel that does not exist", () => {
			const bus = EventBus.create();
			expect(() => {
				bus.removeChannel("testChannel2");
			}).not.toThrow();
		});
	});

	describe("removeSubscription", () => {
		test("does not error attempting to remove a subscriptio that does not exist", () => {
			const bus = EventBus.create();
			expect(() => {
				bus.removeSubscription({ channel: "testChannel", name: "testName", callback: "textCb" });
			}).not.toThrow();
		});
	});
});
