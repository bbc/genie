import * as Sprite from "./sprite.js";

const Stub = {
    add: {
        sprite: () => {
            return Sprite.Stub();
        },
        group: () => {},
    },
    canvas: {
        setAttribute: () => {},
    },
    stage: {
        backgroundColor: "",
    },
    state: {
        current: {},
    },
};

export { Stub };
