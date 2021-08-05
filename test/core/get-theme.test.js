/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../mock/gmi";
import * as params from "../../src/core/parse-url-params";

import { getTheme } from "../../src/core/get-theme";

describe("Core - Get Theme", () => {
	let mockGmi;
	let mockUrlParams;

	beforeEach(() => {
		mockGmi = { embedVars: { configPath: "embed-vars-theme" } };
		mockUrlParams = {};
		jest.spyOn(params, "parseUrlParams").mockImplementation(() => mockUrlParams);
		createMockGmi(mockGmi);
	});

	test("gets the theme from the URL params for preference", () => {
		mockUrlParams.theme = "url-params-theme";
		expect(getTheme()).toEqual("themes/url-params-theme/");
	});

	test("gets the theme from the embedVars config path when there is no URL param set", () => {
		expect(getTheme()).toEqual(mockGmi.embedVars.configPath);
	});
});
