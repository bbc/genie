import * as Theme from "../../fake/theme.js";
import * as Game from "../../fake/game.js";
import * as OverlayLayout from "../../fake/overlay-layout.js";
import * as Button from "../../fake/button.js";
import * as Scene from "../../fake/scene.js";
import * as Book from "../../../src/core/book.js";
import * as sinon from "sinon";
const assert = sinon.assert;
import * as Chai from "chai";
Chai.should();

describe("Showing pages of a book", () => {
    var book;

    describe("A book with 1 page", () => {
        let onePanel = [{}];

        beforeEach(() => {
            book = Book.Start(
                "myScreen",
                Theme.WithPanels(onePanel),
                Game.Stub,
                Scene.WithButtons({ howToPlayNext: Button.Stub(), howToPlayPrevious: Button.Stub() }),
                OverlayLayout.Stub,
            );
        });

        it("Should show page 1", () => {
            book.firstPage.should.have.property("visible", true);
        });

        it("Should disable the 'Previous page' option", () => {
            book.previousPageOption.should.have.property("alpha", 0);
        });

        it("Should disable the 'Next page' option", () => {
            book.nextPageOption.should.have.property("alpha", 0);
        });
    });

    describe("A book with 2 pages", () => {
        var book;
        let twoPanels = [{}, {}];

        beforeEach(() => {
            book = Book.Start(
                "myScreen",
                Theme.WithPanels(twoPanels),
                Game.Stub,
                Scene.WithButtons({ howToPlayNext: Button.Stub(), howToPlayPrevious: Button.Stub() }),
                OverlayLayout.Stub,
            );

            book.nextPageOption.update = sinon.spy();
            book.nextPageOption.accessibleElement.focus = sinon.spy();
            book.previousPageOption.update = sinon.spy();
            book.previousPageOption.accessibleElement.focus = sinon.spy();
        });

        it("Should write all the pages", () => {
            book.numberOfPages.should.equal(2);
        });

        describe("Front to back", () => {
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

            it("Should auto-focus the next page button after navigating to first page", () => {
                book = Book.GoToPage(1, book);
                assert.calledOnce(book.nextPageOption.accessibleElement.focus);
            });

            it("Should not auto-focus the next page button when initially opening the first page", () => {
                book = Book.GoToPage(1, book, true);
                assert.notCalled(book.nextPageOption.accessibleElement.focus);
            });

            it("Should show page 2 and hide page 1 when the 'Next page' option is chosen", () => {
                book = Book.NextPage(book);
                book.page(2).should.have.property("visible", true);
                book.page(1).should.have.property("visible", false);
            });
        });

        describe("Back to front", () => {
            it("Should enable the 'Previous page' option", () => {
                book = Book.NextPage(book);
                book.previousPageOption.should.have.property("alpha", 1);
                book.previousPageOption.input.should.have.property("enabled", true);
                assert.calledOnce(book.previousPageOption.update);
            });

            it("Should disable the 'Next page' option", () => {
                book = Book.NextPage(book);
                book.nextPageOption.should.have.property("alpha", 0);
                book.nextPageOption.input.should.have.property("enabled", false);
                assert.calledOnce(book.nextPageOption.update);
            });

            it("Should auto-focus the previous page button after navigating to the last page", () => {
                book = Book.NextPage(book);
                assert.calledOnce(book.previousPageOption.accessibleElement.focus);
            });

            it("Should show page 1 and hide page 2 when the 'Previous page' option is chosen", () => {
                book = Book.NextPage(book);
                book = Book.PreviousPage(book);
                book.page(1).should.have.property("visible", true);
                book.page(2).should.have.property("visible", false);
            });
        });

        describe("[CGPROD-713] Regression - mis-aligned navigation buttons", () => {
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
