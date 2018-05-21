import * as Theme from "../../fake/theme.js";
import * as Game from "../../fake/game.js";
import * as LayoutFactory from "../../fake/layout-factory.js";
import * as Assets from "../../fake/assets";
import * as OverlayLayout from "../../fake/overlay-layout.js";
import * as Button from "../../fake/button.js";
import * as Fp from "lodash/fp";
import * as Chai from "chai";
Chai.should();

const writePanel = (addSprite, assets, layoutFactory) => {
    return panel => {
        const sprite = addSprite(0, 30, assets[panel]);
        layoutFactory.addToBackground(sprite);
        return sprite;
    };
};

const goToPage = (pageNumber, pages) => {
    let page = pages[pageNumber - 1];

    if (page !== null) {
        page.visible = true;
    }
};

const writePages = (panels, writePanel) => {
    return Fp.map(writePanel)(panels);
};

const writeButtons = (layoutFactory, overlayLayout) => {
    const gelLayout = layoutFactory.addLayout([
        "howToPlayBack",
        "audioOff",
        "settings",
        "howToPlayPrevious",
        "howToPlayNext",
    ]);
    overlayLayout.moveGelButtonsToTop(gelLayout);
    return gelLayout;
};

const writeBook = (theme, writePanel, layoutFactory, overlayLayout) => {
    let pages = writePages(theme.panels, writePanel);
    let buttonLayout = writeButtons(layoutFactory, overlayLayout);

    let nextPageOption = buttonLayout.buttons["howToPlayNext"];
    let previousPageOption = buttonLayout.buttons["howToPlayPrevious"];

    if (pages.length === 1) {
        previousPageOption.visible = false;
        nextPageOption.visible = false;
    }

    goToPage(1, pages);

    return {
        pages: pages,
        nextPageOption: nextPageOption,
        previousPageOption: previousPageOption,
    };
};

describe.only("Showing pages of a book", () => {
    describe("Showing a book with 1 page", () => {
        var book;
        let onePanel = [{}];

        beforeEach(() => {
            book = writeBook(
                Theme.WithPanels(onePanel),
                writePanel(Game.Stub.add.sprite, Assets.Stub, LayoutFactory.Stub),
                LayoutFactory.WithButtons({ howToPlayNext: Button.Stub, howToPlayPrevious: Button.Stub }),
                OverlayLayout.Stub,
            );
        });

        it("Should show page 1", () => {
            let page1 = book.pages[0];
            page1.should.have.property("visible", true);
        });

        it("Should disable the 'Previous page' option", () => {
            book.previousPageOption.should.have.property("visible", false);
        });

        it("Should disable the 'Next' option");
    });

    describe("Showing 2 pages", () => {
        it("Should write each panel as a page", () => {
            let twoPanels = [{}, {}];

            let pages = writePages(twoPanels, writePanel(Game.Stub.add.sprite, Assets.Stub, LayoutFactory.Stub));

            pages.should.have.length(2);
        });

        describe("Front to back", () => {
            it("Should show page 1");
            it("Should enable the 'Next' option");
            it("Should disable the 'Previous' option");
            it("Should show page 2 when the 'Next' option is chosen");
        });

        describe("Back to front", () => {
            it("Should show page 2");
            it("Should enable the 'Previous' option");
            it("Should disable the 'Next' option");
            it("Should show page 1 when the 'Previous' option is chosen");
        });
    });
});
