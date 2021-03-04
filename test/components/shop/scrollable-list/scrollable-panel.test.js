/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createScrollablePanel } from "../../../../src/components/shop/scrollable-list/scrollable-panel.js";

describe("Scrollable Panel", () => {
    let mockScene;
    let mockParent;
    beforeEach(() => {
        mockScene = {
            rexUI: {
                add: {
                    sizer: jest.fn(),
                    scrollablePanel: jest.fn(() => ({ layout: jest.fn() })),
                },
            },
            add: {
                image: jest.fn(),
            },
            config: {
                listPadding: 10,
                space: 10,
            },
            layout: {
                getSafeArea: jest.fn(() => ({ height: 10 })),
            },
        };
        mockParent = { reset: jest.fn() };
    });

    afterEach(jest.clearAllMocks);

    test("reset method calls parent reset", () => {
        const { scrollablePanel } = createScrollablePanel(mockScene, "shop", mockParent);
        scrollablePanel.reset();

        expect(mockParent.reset).toHaveBeenCalled();
    });
});
