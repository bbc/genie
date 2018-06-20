import * as Sprite from "./sprite.js";

const Stub = {
    add: {
        sprite: () => {
            return Sprite.Stub();
        },
    },
    state: {
        current: {},
    },
};

export { Stub };
