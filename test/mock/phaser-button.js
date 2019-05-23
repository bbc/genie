/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const createMockButton = () => {
    return {
        accessibleElement: {
            focus: jest.fn(),
        },
        alpha: 1,
        input: {
            enabled: true,
        },
        update: jest.fn(),
        visible: true,
        elementEvents: {
            click: jest.fn(),
            keyup: jest.fn(),
        },
    };
};

export { createMockButton };
