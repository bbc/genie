/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const createMockGame = () => ({
    add: {
        audio: jest.fn(),
        sprite: jest.fn(),
        group: jest.fn(),
    },
    sound: {
        remove: jest.fn(),
    },
    stage: {
        backgroundColor: "",
    },
    state: {
        current: jest.fn(),
    },
    canvas: {
        parentElement: {
            appendChild: jest.fn(),
            addEventListener: jest.fn(),
        },
        setAttribute: jest.fn(),
    },
    time: {
        events: {
            add: jest.fn().mockImplementation((ms, callback) => {
                callback();
            }),
        },
    },
});

export { createMockGame };
