/**
 * Thin wrapper for Bowser {@link https://github.com/lancedikson/bowser}
 *
 * Exposes the browser name and any browser sniffing shortcuts used in Genie.
 *
 * @module core/scene
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
//TODO Move this import to package.json dependency once our PR is merged into Bowser.
import Bowser from "../../lib/bowser/bowser.js";

export const getBrowser = () => {
    const browserInfo = Bowser.getParser(window.navigator.userAgent);

    const name = browserInfo.getBrowserName();
    const version = browserInfo.getBrowserVersion();

    return {
        name,
        version,
        isSilk: name === "Amazon Silk",
    };
};
