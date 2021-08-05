/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as safeAreaDraw from "../../../src/core/debug/safe-area-draw.js";
import { eventBus } from "../../../src/core/event-bus.js";

describe("safe area draw", () => {
	let mockScreen;
	let mockTileSprite;
	let mockContainer;

	beforeEach(() => {
		mockTileSprite = {
			setPosition: jest.fn(),
			setSize: jest.fn(),
		};

		mockScreen = {
			add: {
				tileSprite: jest.fn().mockReturnValue(mockTileSprite),
			},
			layout: {
				getSafeArea: jest.fn().mockReturnValue({ top: 1, width: 2, height: 3 }),
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
		test("adds a tileSprite to represent the safe interactable area", () => {
			safeAreaDraw.create(mockContainer);
			expect(mockTileSprite.setSize.mock.calls[0]).toEqual([2, 3]);
		});

		test("removes scale subscription on scene shutdown", () => {
			safeAreaDraw.create(mockContainer);
			expect(mockScreen.events.once).toHaveBeenLastCalledWith("shutdown", expect.any(Function));
			mockScreen.events.once.mock.calls[0][1]();
			const removeSubCall = eventBus.removeSubscription.mock.calls[0][0];
			expect(removeSubCall.channel).toBe("scaler");
			expect(removeSubCall.name).toBe("sizeChange");
			expect(removeSubCall.callback).toStrictEqual(expect.any(Function));
		});
	});
});
