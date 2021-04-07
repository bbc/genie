/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as balance from "../../../src/components/shop/balance.js";
import { collections } from "../../../src/core/collections.js";

jest.mock("../../../src/core/collections.js");

describe("setBalance", () => {
    let mockScene;
    let mockManageCollection;
    let mockBalanceItem;

    beforeEach(() => {
        mockBalanceItem = { qty: 50 };
        mockManageCollection = { get: jest.fn().mockReturnValue(mockBalanceItem) };
        collections.get = jest.fn().mockReturnValue(mockManageCollection);
        mockScene = {
            scene: { key: "sceneKey" },
            transientData: {
                shop: { config: { balance: "balance", shopCollections: { manage: "manage" } } },
                sceneKey: { data: "mock" },
            },
        };
    });

    afterEach(jest.clearAllMocks);

    test("sets balance item to transientData", () => {
        balance.setBalance(mockScene);
        expect(mockScene.transientData[mockScene.scene.key]).toEqual({
            ...mockScene.transientData[mockScene.scene.key],
            balance: mockBalanceItem.qty,
        });
    });
});
