import * as Actor from "./actor";

const Draw = (assets, drawActor) => {
    return panel => drawActor(Actor.Create(0, 30, assets[panel]));
};

export { Draw };
