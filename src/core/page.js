import * as Scenery from "./scenery.js";

const Draw = (assets, drawScenery) => {
    return panel => {
        const scenery = Scenery.Create(0, 30, assets[panel]);
        return drawScenery(scenery);
    };
};

export { Draw };
