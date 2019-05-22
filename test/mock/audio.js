/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const createMockAudio = () => ({
    fadeIn: jest.fn(),
    fadeOut: jest.fn(),
    loopFull: jest.fn(),
    stop: jest.fn(),
});

export { createMockAudio };
