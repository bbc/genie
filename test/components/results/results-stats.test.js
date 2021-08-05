/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { fireGameCompleteStat } from "../../../src/components/results/results-stats.js";
import { gmi } from "../../../src/core/gmi/gmi.js";

describe("Results Screen", () => {
	beforeEach(() => {
		gmi.sendStatsEvent = jest.fn();
	});

	afterEach(() => jest.clearAllMocks());

	describe("fireGameCompleteStat", () => {
		test("fires a score stat with results if given as a number", () => {
			fireGameCompleteStat({ keys: 45 });
			expect(gmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", { metadata: "SCO=[keys-45]" });
		});

		test("fires a score stat with results with two results", () => {
			fireGameCompleteStat({ keys: 45, gems: 30 });

			expect(gmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", {
				metadata: "SCO=[keys-45]::[gems-30]",
			});
		});

		test("fires the correct stat when gameComplete is passed through", () => {
			fireGameCompleteStat({ keys: 45, gems: 30, gameComplete: true });

			expect(gmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", {
				metadata: "SCO=[keys-45]::[gems-30]",
			});
		});

		test("fires a score stat to the GMI without results if neither a string nor a number is given", () => {
			fireGameCompleteStat({});
			expect(gmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", { source: undefined });
		});

		test("fires a score stat to the GMI with the levelId from transientData", () => {
			fireGameCompleteStat({ levelId: "Level Zero" });
			expect(gmi.sendStatsEvent).toHaveBeenCalledWith("score", "display", { source: "Level Zero" });
		});
	});
});
