/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

const domElement = () => {
    const element = {
        setAttribute: jest.fn().mockImplementation((attribute, value) => {
            element.attributes[attribute] = value;
        }),
        style: {},
        attributes: {},
        insertBefore: jest.fn(),
        contains: jest.fn(),
        removeChild: jest.fn(),
        appendChild: jest.fn(),
    };
    return element;
};

export { domElement };
