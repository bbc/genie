/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as Scenery from "./scenery.js";

const Draw = (screenName, drawScenery) => {
    return panel => {
        const scenery = Scenery.Create(0, 30, screenName + "." + panel);
        return drawScenery(scenery);
    };
};

export { Draw };
