import * as helpers from "../../../../src/core/layout/scrollable-list/scrollable-list-helpers.js";

describe("Scrollable List helpers", () => {

    afterEach(() => jest.clearAllMocks());

    describe("onClick", () => {
        test("calls console.log", () => {
            console.log = jest.fn();
            const mockGelButton = { config: { id: "foo"}};
            helpers.onClick(mockGelButton);
            expect(console.log).toHaveBeenCalledWith("Clicked foo");
        });
    });
    describe("assetKey", () => {
        test("concatenates the asset prefix with the asset key", () => {
            const assetKeys = { prefix: "foo" };
            const concatenatedKey = helpers.assetKey("bar", assetKeys)
            expect(concatenatedKey).toEqual("foo.bar");
        });
    });
});
