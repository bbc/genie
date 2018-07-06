import * as Sprite from "./sprite.js";
import * as Audio from "./audio.js";

const Stub = {
    add: {
        audio: () => {
            return Audio.Stub();
        },
        sprite: () => {
            return Sprite.Stub();
        },
        group: () => {},
    },
    canvas: {
        setAttribute: () => {},
    },
    sound: {},
    stage: {
        backgroundColor: "",
    },
    state: {
        current: {},
    },
};

export { Stub };
