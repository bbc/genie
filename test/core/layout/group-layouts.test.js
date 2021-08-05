/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as fp from "lodash/fp";
import { groupLayouts } from "../../../src/core/layout/group-layouts";

describe("Group Layouts", () => {
	test("matches the test constant", () => {
		const expectedGroupLayouts = [
			{ vPos: "top", hPos: "left" },
			{ vPos: "top", hPos: "right" },
			{ vPos: "middle", hPos: "left" },
			{ vPos: "middle", hPos: "left", safe: true },
			{ vPos: "middle", hPos: "center" },
			{ vPos: "middle", hPos: "center", arrangeV: true },
			{ vPos: "middle", hPos: "right" },
			{ vPos: "middle", hPos: "right", safe: true },
			{ vPos: "bottom", hPos: "left" },
			{ vPos: "bottom", hPos: "center" },
			{ vPos: "bottom", hPos: "right" },
		];
		expect(fp.isEqual(expectedGroupLayouts, groupLayouts)).toBe(true);
	});
});
