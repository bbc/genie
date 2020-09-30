import { scrollablePanel } from "../../../../src/core/layout/scrollable-list/scrollable-list.js";

describe.only("scrollablePanel", () => {
    
    afterEach(() => jest.clearAllMocks());

    describe("scrollableList", () => {
        test("gets the panel config", () => {
            expect(false).toBe(true);
        });

        test("calls into rexUI to add a scrollable panel", () => {
            expect(false).toBe(true);
        });

        test("sets scene.input.topOnly to false", () => {
            expect(false).toBe(true);
        });
    });

    describe("getPanelConfig", () => {
        test("adds images for panel background, scrollbar, and handle", () => {
            expect(false).toBe(true);
        });

        test("gets the panel from getPanel", () => {
            expect(false).toBe(true);
        });
    });

    describe("createPanel", () => {
        test("creates a rexUI sizer", () => {
            expect(false).toBe(true);
        });

        test("calls createTable and adds that object to its sizer", () => {
            expect(false).toBe(true);
        });
    });

    describe("createTable", () => {
        test("creates a rexUI grid sizer", () => {
            expect(false).toBe(true);
        });

        test("calls createItem per item and adds it to the grid sizer", () => {
            expect(false).toBe(true);
        });

        test("wraps the grid sizer in a regular sizer", () => {
            expect(false).toBe(true);
        });
    });

    describe("createItem", () => {
        test("creates a rexUI label", () => {
            expect(false).toBe(true);
        });

        test("calls createGelButton and uses the result as icon", () => {
            expect(false).toBe(true);
        });
    });
});
