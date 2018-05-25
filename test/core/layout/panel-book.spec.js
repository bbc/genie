import * as Theme from "../../fake/theme.js";
import * as Game from "../../fake/game.js";
import * as LayoutFactory from "../../fake/layout-factory.js";
import * as Assets from "../../fake/assets";
import * as OverlayLayout from "../../fake/overlay-layout.js";
import * as Button from "../../fake/button.js";
import * as Actor from "../../../src/core/actor.js";
import * as Page from "../../../src/core/page.js";
import * as Buttons from "../../../src/core/button.js";
import * as Book from "../../../src/core/book.js";
import * as Chai from "chai";
Chai.should();

describe.only("Showing pages of a book", () => {
    var book;

    describe("A book with 1 page", () => {
        let onePanel = [{}];

        beforeEach(() => {
            book = Book.Draw(
                Theme.WithPanels(onePanel),
                Page.Draw(Assets.Stub, Actor.Draw(Game.Stub.add.sprite, LayoutFactory.Stub.addToBackground)),
                Buttons.Draw(
                    LayoutFactory.WithButtons({ Next: Button.Stub(), Previous: Button.Stub() }),
                    OverlayLayout.Stub,
                ),
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
            book = Book.Draw(
                Theme.WithPanels(twoPanels),
                Page.Draw(Assets.Stub, Actor.Draw(Game.Stub.add.sprite, LayoutFactory.Stub.addToBackground)),
                Buttons.Draw(
                    LayoutFactory.WithButtons({ Next: Button.Stub(), Previous: Button.Stub() }),
                    OverlayLayout.Stub,
                ),
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
