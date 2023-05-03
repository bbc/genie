/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const domElement = () => {
	const attributes = {};

	return {
		get attributes() {
			return attributes;
		},
		setAttribute: jest.fn((attribute, value) => {
			attributes[attribute] = value;
		}),
		getAttribute: attribute => attributes[attribute],
		style: {},
		classList: {
			add: jest.fn(),
			remove: jest.fn(),
		},
		focus: jest.fn(),
		insertBefore: jest.fn(),
		contains: jest.fn(),
		removeChild: jest.fn(),
		appendChild: jest.fn(),
		parentElement: {
			appendChild: jest.fn(),
			insertBefore: jest.fn(),
			removeChild: jest.fn(),
		},
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		childNodes: [],
	};
};

export { domElement };
