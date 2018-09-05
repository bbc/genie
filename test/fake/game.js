/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
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
    sound: {
        remove: () => {},
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
            addEventListener: () => {},
        },
        setAttribute: () => {},
    },
    time: {
        events: {
            add: (ms, callback) => {
                callback();
            },
        },
    },
};

export { Stub };
