import * as Theme from "../../fake/theme.js";
import * as Game from "../../fake/game.js";
import * as OverlayLayout from "../../fake/overlay-layout.js";
import * as Button from "../../fake/button.js";
import * as Scene from "../../fake/scene.js";
import * as Book from "../../../src/core/book/book.js";
import * as accessibleCarouselElements from "../../../src/core/accessibility/accessible-carousel-elements.js";

import * as sinon from "sinon";
import * as Chai from "chai";
import { assert } from "chai";
Chai.should();

describe("Showing pages of a book", () => {
    const sandbox = sinon.createSandbox();
    let book;

    afterEach(() => {
        sandbox.restore();
    });

    describe("A book with 1 page", () => {
        const onePanel = [{ onDestroy: () => {} }];
        const accessibilityTexts = [{ accessibilityText: "Text goes here" }];

        beforeEach(() => {
            const mockScreen = {
                scene: Scene.WithButtons({ howToPlayNext: Button.Stub(), howToPlayPrevious: Button.Stub() }),
                visibleLayer: "book-test",
            };

            sandbox.stub(accessibleCarouselElements, "create").returns([document.createElement("div")]);
            book = Book.Start(
                "myScreen",
                Theme.WithPanels(onePanel),
                Game.Stub,
                mockScreen,
                OverlayLayout.Stub,
                accessibilityTexts,
            );
        });

        it("Should show page 1", () => {
            book.firstPage.should.have.property("visible", true);
        });

        it("creates an accessible carousel dom element", () => {
            sandbox.assert.calledOnce(
                accessibleCarouselElements.create.withArgs(
                    "book-test",
                    [{ visible: true }],
                    Game.Stub.canvas.parentElement,
                    accessibilityTexts,
                ),
            );
        });

        it("Should disable the 'Previous page' option", () => {
            book.previousPageOption.should.have.property("alpha", 0);
        });

        it("Should disable the 'Next page' option", () => {
            book.nextPageOption.should.have.property("alpha", 0);
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
            nextButtonStub.accessibleElement.focus = sinon.spy();
            previousButtonStub.accessibleElement.focus = sinon.spy();
            const mockScreen = {
                scene: Scene.WithButtons({ howToPlayNext: nextButtonStub, howToPlayPrevious: previousButtonStub }),
                visibleLayer: "book-test",
            };

            sandbox.stub(accessibleCarouselElements, "create").returns(domElements);
            book = Book.Start(
                "myScreen",
                Theme.WithPanels(twoPanels),
                Game.Stub,
                mockScreen,
                OverlayLayout.Stub,
                accessibilityTexts,
                mockScreen,
            );

            book.nextPageOption.update = sinon.spy();
            book.previousPageOption.update = sinon.spy();
        });

        describe("Initialisation", () => {
            it("Should write all the pages", () => {
                book.numberOfPages.should.equal(2);
            });

            it("creates an accessible carousel dom element", () => {
                sandbox.assert.calledOnce(
                    accessibleCarouselElements.create.withArgs(
                        "book-test",
                        [{ visible: true }, { visible: false }],
                        Game.Stub.canvas.parentElement,
                        accessibilityTexts,
                    ),
                );
            });

            it("Should show page 1", () => {
                book.firstPage.should.have.property("visible", true);
            });

            it("Should disable the 'Previous page' option", () => {
                book.previousPageOption.should.have.property("alpha", 0);
                book.previousPageOption.input.should.have.property("enabled", false);
            });

            it("Should enable the 'Next page' option", () => {
                book.nextPageOption.should.have.property("alpha", 1);
                book.nextPageOption.input.should.have.property("enabled", true);
            });

            it("Regression Test - should not auto-focus either the next or previous page button", () => {
                sinon.assert.notCalled(nextButtonStub.accessibleElement.focus);
                sinon.assert.notCalled(previousButtonStub.accessibleElement.focus);
            });
        });

        describe("Front to Back (Next Page)", () => {
            beforeEach(() => {
                book = Book.NextPage(book);
            });

            it("Should show page 2 and hide page 1 when the 'Next page' option is chosen", () => {
                book.page(2).should.have.property("visible", true);
                book.page(1).should.have.property("visible", false);
            });

            it("shows the dom element for page 2 and hides the dom element for page 1 when the 'Next page' option is chosen", () => {
                assert.equal(domElements[0].getAttribute("aria-hidden"), "true");
                assert.equal(domElements[1].getAttribute("aria-hidden"), "false");
            });

            it("Should enable the 'Previous page' option", () => {
                book.previousPageOption.should.have.property("alpha", 1);
                book.previousPageOption.input.should.have.property("enabled", true);
                sinon.assert.calledOnce(book.previousPageOption.update);
            });

            it("Should disable the 'Next page' option", () => {
                book.nextPageOption.should.have.property("alpha", 0);
                book.nextPageOption.input.should.have.property("enabled", false);
                sinon.assert.calledOnce(book.nextPageOption.update);
            });

            it("Should auto-focus the previous page button after navigating to the last page", () => {
                sinon.assert.calledOnce(previousButtonStub.accessibleElement.focus);
            });
        });

        describe("Back to front (Previous Page)", () => {
            beforeEach(() => {
                book = Book.GoToPage(2, book);
                nextButtonStub.accessibleElement.focus.resetHistory();
                previousButtonStub.accessibleElement.focus.resetHistory();
                book.previousPageOption.update.resetHistory();
                book.nextPageOption.update.resetHistory();
                book = Book.PreviousPage(book);
            });

            it("Should show page 1 and hide page 2 when the 'Previous page' option is chosen", () => {
                book.page(1).should.have.property("visible", true);
                book.page(2).should.have.property("visible", false);
            });

            it("shows the dom element for page 1 and hides the dom element for page 2 when the 'Previous page' option is chosen", () => {
                assert.equal(domElements[0].getAttribute("aria-hidden"), "false");
                assert.equal(domElements[1].getAttribute("aria-hidden"), "true");
            });

            it("Should disable the 'Previous page' option", () => {
                book.previousPageOption.should.have.property("alpha", 0);
                book.previousPageOption.input.should.have.property("enabled", false);
                sinon.assert.calledOnce(book.previousPageOption.update);
            });

            it("Should enable the 'Next page' option", () => {
                book.nextPageOption.should.have.property("alpha", 1);
                book.nextPageOption.input.should.have.property("enabled", true);
                sinon.assert.calledOnce(book.nextPageOption.update);
            });

            it("Should auto-focus the previous page button after navigating to the last page", () => {
                sinon.assert.calledOnce(nextButtonStub.accessibleElement.focus);
            });
        });

        describe("Regression Test - mis-aligned navigation buttons", () => {
            it("Should not modify the visibile property of the 'Next page' and 'Previous page' buttons so they still scale", () => {
                book.nextPageOption.should.have.property("visible", true);
                book.previousPageOption.should.have.property("visible", true);
                book = Book.NextPage(book);
                book.nextPageOption.should.have.property("visible", true);
                book.previousPageOption.should.have.property("visible", true);
            });
        });
    });
});
