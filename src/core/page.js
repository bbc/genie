import * as Scenery from "./scenery.js";

const Draw = (screenName, drawScenery) => {
    return panel => {
        const scenery = Scenery.Create(0, 30, screenName + "." + panel);
        return drawScenery(scenery);
    };
};

export { Draw };
