import * as Theme from "../../fake/theme.js";
import * as Game from "../../fake/game.js";
import * as OverlayLayout from "../../fake/overlay-layout.js";
import * as Button from "../../fake/button.js";
import * as Scene from "../../fake/scene.js";
import * as Scenery from "../../../src/core/scenery.js";
import * as Book from "../../../src/core/book.js";
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
            book.previousPageOption.should.have.property("visible", false);
        });

        it("Should disable the 'Next page' option", () => {
            book.nextPageOption.should.have.property("visible", false);
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
        });

        it("Should write all the pages", () => {
            book.numberOfPages.should.equal(2);
        });

        describe("Front to back", () => {
            it("Should show page 1", () => {
                book.firstPage.should.have.property("visible", true);
            });

            it("Should disable the 'Previous page' option", () => {
                book.previousPageOption.should.have.property("visible", false);
            });

            it("Should enable the 'Next page' option", () => {
                book.nextPageOption.should.have.property("visible", true);
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
                book.previousPageOption.should.have.property("visible", true);
            });

            it("Should disable the 'Next page' option", () => {
                book = Book.NextPage(book);
                book.nextPageOption.should.have.property("visible", false);
            });

            it("Should show page 1 and hide page 2 when the 'Previous page' option is chosen", () => {
                book = Book.NextPage(book);
                book = Book.PreviousPage(book);
                book.page(1).should.have.property("visible", true);
                book.page(2).should.have.property("visible", false);
            });
        });
    });
});
