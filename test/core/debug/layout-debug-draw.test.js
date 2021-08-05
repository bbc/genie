/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as debugLayout from "../../../src/core/debug/layout-debug-draw.js";
import * as Scaler from "../../../src/core/scaler.js";
import { eventBus } from "../../../src/core/event-bus.js";

describe("Layout debug draw", () => {
	let mockScreen;
	let mockTileSprite;
	let mockContainer;

	beforeEach(() => {
		mockTileSprite = {
			setPosition: jest.fn(),
			setSize: jest.fn(),
			setTileScale: jest.fn(),
		};

		const mockMetrics = { scale: 1 };
		Scaler.getMetrics = jest.fn(() => mockMetrics);
		mockScreen = {
			game: {
				canvas: { width: 800, height: 600 },
				scale: { parent: { offsetWidth: 800, offsetHeight: 600 } },
			},
			add: {
				tileSprite: jest.fn(() => mockTileSprite),
			},
			events: {
				once: jest.fn(),
			},
		};

		mockContainer = {
			scene: mockScreen,
			add: jest.fn(),
		};

		eventBus.removeSubscription = jest.fn();
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	describe("create function", () => {
		test("adds a tilesprite to represent the game area", () => {
			debugLayout.create(mockContainer);
			expect(mockTileSprite.setSize.mock.calls[0]).toEqual([800, 600]);
		});

		test("adds tilesprites to represent the outer GEL padding", () => {
			debugLayout.create(mockContainer);
			expect(mockTileSprite.setPosition.mock.calls[0]).toEqual([0, -292]);
			expect(mockTileSprite.setPosition.mock.calls[1]).toEqual([0, 292]);
			expect(mockTileSprite.setPosition.mock.calls[2]).toEqual([-392, 0]);
			expect(mockTileSprite.setPosition.mock.calls[3]).toEqual([392, 0]);

			expect(mockTileSprite.setSize.mock.calls[1]).toEqual([800, 16]);
			expect(mockTileSprite.setSize.mock.calls[2]).toEqual([800, 16]);
			expect(mockTileSprite.setSize.mock.calls[3]).toEqual([16, 600]);
			expect(mockTileSprite.setSize.mock.calls[4]).toEqual([16, 600]);
		});

		test("adds tilesprites to represent the outer GEL padding when aspect ratio is above 4:3", () => {
			mockScreen.game.scale.parent = { offsetWidth: 1600, offsetHeight: 800 };

			debugLayout.create(mockContainer);

			expect(mockTileSprite.setPosition.mock.calls[0]).toEqual([0, -288]);
			expect(mockTileSprite.setPosition.mock.calls[1]).toEqual([0, 288]);
			expect(mockTileSprite.setPosition.mock.calls[2]).toEqual([-588, 0]);
			expect(mockTileSprite.setPosition.mock.calls[3]).toEqual([588, 0]);

			expect(mockTileSprite.setSize.mock.calls[1]).toEqual([1200, 24]);
			expect(mockTileSprite.setSize.mock.calls[2]).toEqual([1200, 24]);
			expect(mockTileSprite.setSize.mock.calls[3]).toEqual([24, 600]);
			expect(mockTileSprite.setSize.mock.calls[4]).toEqual([24, 600]);
		});

		test("removes scale subscription on scene shutdown", () => {
			debugLayout.create(mockContainer);
			expect(mockScreen.events.once).toHaveBeenLastCalledWith("shutdown", expect.any(Function));

			mockScreen.events.once.mock.calls[0][1]();

			const removeSubCall = eventBus.removeSubscription.mock.calls[0][0];

			expect(removeSubCall.channel).toBe("scaler");
			expect(removeSubCall.name).toBe("sizeChange");
			expect(removeSubCall.callback).toStrictEqual(expect.any(Function));
		});
	});
});
