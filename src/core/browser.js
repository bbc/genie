/**
 * Thin wrapper for Bowser {@link https://github.com/lancedikson/bowser}
 *
 * Exposes the browser name and any browser sniffing shortcuts used in Genie.
 *
 * @module core/browser
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import Bowser from "/node_modules/bowser/src/bowser.js";

export const getBrowser = () => {
	const browserInfo = Bowser.getParser(window.navigator.userAgent);

	const name = browserInfo.getBrowserName();
	const version = browserInfo.getBrowserVersion();
	const isKindleWebView = new RegExp(
		/KFDOWI|KFONWI|KFMAWI|KFMUWI|KFKAWI|KFSUWI|KFAUWI|KFTBWI|KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI|KFFOWI|KFGIWI|KFMEWI/g,
	).test(browserInfo.getUA());

	const isSilk = name === "Amazon Silk" || isKindleWebView;
	const forceCanvas = Boolean(browserInfo.satisfies({ safari: "<10" }));

	return {
		name,
		version,
		forceCanvas,
		isSilk,
	};
};
