/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { getSafeAreaFn, getTitleAreaFn } from "../../../src/core/layout/safe-area.js";
import * as ScalerModule from "../../../src/core/scaler.js";

describe("getSafeArea", () => {
	let mockMetrics;
	let mockGroups;

	beforeEach(() => {
		const mockGroup = { addButton: jest.fn(), reset: jest.fn() };
		mockGroups = {
			topLeft: Object.assign({ y: -150, x: -350, height: 50, width: 100 }, mockGroup),
			topRight: Object.assign({ y: 150, x: 350, width: 100 }, mockGroup), //
			middleLeft: mockGroup,
			middleLeftSafe: Object.assign({ x: -250, width: 100 }, mockGroup),
			middleCenter: mockGroup,
			middleCenterV: mockGroup,
			middleRight: mockGroup,
			middleRightSafe: Object.assign({ x: 250, width: 100 }, mockGroup), //
			bottomLeft: mockGroup,
			bottomCenter: Object.assign({ y: 100 }, mockGroup),
			bottomRight: mockGroup,
		};
		mockMetrics = {
			horizontals: jest.fn(),
			safeHorizontals: jest.fn(),
			verticals: jest.fn(),
			isMobile: true,
			screenToCanvas: jest.fn(x => x),
			stageHeight: 800,
			horizontalBorderPad: 20,
			verticalBorderPad: 16,
		};

		ScalerModule.getMetrics = jest.fn(() => mockMetrics);
	});

	afterEach(() => jest.clearAllMocks());

	test("returns the central screen rectangle on mobile", () => {
		const safeAreaFn = getSafeAreaFn(mockGroups);
		expect(safeAreaFn()).toEqual(new Phaser.Geom.Rectangle(-150, -100, 400, 200));
	});

	test("returns the central screen rectangle on desktop", () => {
		mockMetrics.isMobile = false;
		const safeAreaFn = getSafeAreaFn(mockGroups);
		expect(safeAreaFn()).toEqual(new Phaser.Geom.Rectangle(-130, -100, 360, 190));
	});

	test("Sets top position to border pad if top: false is passed in to group overrides", () => {
		mockMetrics.isMobile = false;
		const safeAreaFn = getSafeAreaFn(mockGroups);
		expect(safeAreaFn({ top: false })).toEqual(new Phaser.Geom.Rectangle(-130, -384, 360, 474));
	});

	test("Forces top and bottom pad to be the same if one is smaller", () => {
		mockMetrics.isMobile = false;
		mockGroups.bottomCenter.y = 1000;
		const safeAreaFn = getSafeAreaFn(mockGroups);
		expect(safeAreaFn({ top: false })).toEqual(new Phaser.Geom.Rectangle(-130, -384, 360, 768));
	});

	test("does not conform the bottom pad value if mirrorY is passed as false", () => {
		mockMetrics.isMobile = false;
		mockGroups.bottomCenter.y = 1000;
		const safeAreaFn = getSafeAreaFn(mockGroups);
		expect(safeAreaFn({}, false)).toEqual(new Phaser.Geom.Rectangle(-130, -100, 360, 1090));
	});

	test("topLeft and topRight values have a fixed width of 64 ", () => {
		mockGroups.topLeft.width = 0;
		mockGroups.topRight.width = 0;
		const safeAreaFn = getSafeAreaFn(mockGroups);
		expect(safeAreaFn()).toEqual(new Phaser.Geom.Rectangle(-150, -100, 400, 200));
	});

	test("getTitleAreaFn returns a function that returns the correct title area", () => {
		const titleAreaFn = getTitleAreaFn(mockGroups);
		expect(titleAreaFn()).toEqual(new Phaser.Geom.Rectangle(-250, -380, 600, 50));
	});
});
