/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

const paths = [
    [x => x.gameButton && !x.scene, x => x.key],
    [x => x.gameButton, x => `${x.scene}.${x.key}`],
    [x => x.isMobile, x => "gelMobile." + x.key],
    [x => !x.isMobile, x => "gelDesktop." + x.key],
];

export const assetPath = fp.cond(paths);
