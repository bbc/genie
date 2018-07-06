import * as Sprite from "./sprite.js";

const Stub = {
    load: {
        json: () => {},
    },
    add: {
        sprite: () => {
            return Sprite.Stub();
        },
        group: () => {},
    },
    stage: {
        backgroundColor: "",
    },
    state: {
        current: {},
    },
    canvas: {
        parentElement: {
            appendChild: () => {},
        },
        setAttribute: () => {},
    },
};

export { Stub };
