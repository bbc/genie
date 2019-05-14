/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as Theme from "../../fake/theme.js";
import * as Game from "../../fake/game.js";
import * as OverlayLayout from "../../fake/overlay-layout.js";
import * as Button from "../../fake/button.js";
import * as Scene from "../../fake/scene.js";
import * as Book from "../../../src/core/book/book.js";
import * as accessibleCarouselElements from "../../../src/core/accessibility/accessible-carousel-elements.js";

describe("Showing pages of a book", () => {
    let book;

    afterEach(() => jest.clearAllMocks());

    describe("A book with 1 page", () => {
        const onePanel = [{ onDestroy: () => {} }];
        const accessibilityTexts = [{ accessibilityText: "Text goes here" }];

        beforeEach(() => {
            const mockScreen = {
                scene: Scene.WithButtons({ howToPlayNext: Button.Stub(), howToPlayPrevious: Button.Stub() }),
                visibleLayer: "book-test",
            };

            jest.spyOn(accessibleCarouselElements, "create").mockImplementation(() => [document.createElement("div")]);
            book = Book.Start(
                "myScreen",
                Theme.WithPanels(onePanel),
                Game.Stub,
                mockScreen,
                OverlayLayout.Stub,
                accessibilityTexts,
            );
        });

        test("Shows page 1", () => {
            expect(book.firstPage).toHaveProperty("visible", true);
        });

        test("creates an accessible carousel dom element", () => {
            expect(accessibleCarouselElements.create).toHaveBeenCalledWith(
                "book-test",
                [{ visible: true }],
                Game.Stub.canvas.parentElement,
                accessibilityTexts,
            );
        });

        test("disables the 'Previous page' option", () => {
            expect(book.previousPageOption).toHaveProperty("alpha", 0);
        });

        test("disables the 'Next page' option", () => {
            expect(book.nextPageOption).toHaveProperty("alpha", 0);
        });
    });

    describe("A book with 2 pages", () => {
        let book;
        let twoPanels = [{}, {}];
        let domElements = [document.createElement("div"), document.createElement("div")];
        const accessibilityTexts = [{ accessibilityText: "Text goes here" }, { accessibilityText: "Also goes here" }];
        let nextButtonStub = Button.Stub();
        let previousButtonStub = Button.Stub();

        beforeEach(() => {
            nextButtonStub.accessibleElement.focus = jest.fn();
            previousButtonStub.accessibleElement.focus = jest.fn();
            const mockScreen = {
                scene: Scene.WithButtons({ howToPlayNext: nextButtonStub, howToPlayPrevious: previousButtonStub }),
                visibleLayer: "book-test",
            };

            jest.spyOn(accessibleCarouselElements, "create").mockImplementation(() => domElements);
            book = Book.Start(
                "myScreen",
                Theme.WithPanels(twoPanels),
                Game.Stub,
                mockScreen,
                OverlayLayout.Stub,
                accessibilityTexts,
                mockScreen,
            );

            book.nextPageOption.update = jest.fn();
            book.previousPageOption.update = jest.fn();
        });

        describe("Initialisation", () => {
            test("write all the pages", () => {
                expect(book.numberOfPages).toBe(2);
            });

            test("creates an accessible carousel dom element", () => {
                expect(accessibleCarouselElements.create).toHaveBeenCalledWith(
                    "book-test",
                    [{ visible: true }, { visible: false }],
                    Game.Stub.canvas.parentElement,
                    accessibilityTexts,
                );
            });

            test("Shows page 1", () => {
                expect(book.firstPage).toHaveProperty("visible", true);
            });

            test("Disables the 'Previous page' option", () => {
                expect(book.previousPageOption).toHaveProperty("alpha", 0);
                expect(book.previousPageOption.input).toHaveProperty("enabled", false);
            });

            test("Enables the 'Next page' option", () => {
                expect(book.nextPageOption).toHaveProperty("alpha", 1);
                expect(book.nextPageOption.input).toHaveProperty("enabled", true);
            });

            test("Regression Test - should not auto-focus either the next or previous page button", () => {
                expect(nextButtonStub.accessibleElement.focus).not.toHaveBeenCalled();
                expect(previousButtonStub.accessibleElement.focus).not.toHaveBeenCalled();
            });
        });

        describe("Front to Back (Next Page)", () => {
            beforeEach(() => {
                book = Book.NextPage(book);
            });

            test("show page 2 and hide page 1 when the 'Next page' option is chosen", () => {
                expect(book.page(2)).toHaveProperty("visible", true);
                expect(book.page(1)).toHaveProperty("visible", false);
            });

            test("shows the dom element for page 2 and hides the dom element for page 1 when the 'Next page' option is chosen", () => {
                expect(domElements[0].getAttribute("aria-hidden")).toEqual("true");
                expect(domElements[1].getAttribute("aria-hidden")).toEqual("false");
            });

            test("enables the 'Previous page' option", () => {
                expect(book.previousPageOption).toHaveProperty("alpha", 1);
                expect(book.previousPageOption.input).toHaveProperty("enabled", true);
                expect(book.previousPageOption.update).toHaveBeenCalledTimes(1);
            });

            test("disables the 'Next page' option", () => {
                expect(book.nextPageOption).toHaveProperty("alpha", 0);
                expect(book.nextPageOption.input).toHaveProperty("enabled", false);
                expect(book.nextPageOption.update).toHaveBeenCalledTimes(1);
            });

            test("auto-focus the previous page button after navigating to the last page", () => {
                expect(previousButtonStub.accessibleElement.focus).toHaveBeenCalledTimes(1);
            });
        });

        describe("Back to front (Previous Page)", () => {
            beforeEach(() => {
                book = Book.GoToPage(2, book);
                book = Book.PreviousPage(book);
            });

            test("shows page 1 and hides page 2 when the 'Previous page' option is chosen", () => {
                expect(book.page(1)).toHaveProperty("visible", true);
                expect(book.page(2)).toHaveProperty("visible", false);
            });

            test("shows the dom element for page 1 and hides the dom element for page 2 when the 'Previous page' option is chosen", () => {
                expect(domElements[0].getAttribute("aria-hidden")).toBe("false");
                expect(domElements[1].getAttribute("aria-hidden")).toBe("true");
            });

            test("Disables the 'Previous page' option", () => {
                expect(book.previousPageOption).toHaveProperty("alpha", 0);
                expect(book.previousPageOption.input).toHaveProperty("enabled", false);
                expect(book.previousPageOption.update).toHaveBeenCalledTimes(2);
            });

            test("Enables the 'Next page' option", () => {
                expect(book.nextPageOption).toHaveProperty("alpha", 1);
                expect(book.nextPageOption.input).toHaveProperty("enabled", true);
                expect(book.nextPageOption.update).toHaveBeenCalledTimes(2);
            });

            test("Auto-focuses the previous page button after navigating to the last page", () => {
                expect(nextButtonStub.accessibleElement.focus).toHaveBeenCalledTimes(1);
            });
        });

        describe("Regression Test - mis-aligned navigation buttons", () => {
            test("does not modify the visible property of the 'Next page' and 'Previous page' buttons so they still scale", () => {
                expect(book.nextPageOption).toHaveProperty("visible", true);
                expect(book.previousPageOption).toHaveProperty("visible", true);
                book = Book.NextPage(book);
                expect(book.nextPageOption).toHaveProperty("visible", true);
                expect(book.previousPageOption).toHaveProperty("visible", true);
            });
        });
    });
});
