import * as Page from "./page.js";
import * as Scenery from "./scenery.js";
import * as Button from "./button.js";
import fp from "../../lib/lodash/fp/fp.js";

const configureButtonsForPage = (pageNumber, book) => {
    if (pageNumber >= 1 && book.numberOfPages >= pageNumber) {
        book.nextPageOption.visible = book.numberOfPages > pageNumber;
        book.previousPageOption.visible = pageNumber > 1;
    }
};

const GoToPage = (pageNumber, book) => {
    if (pageNumber > book.numberOfPages) {
        return book;
    }

    book.hidePage(book.currentPageNumber);
    book.showPage(pageNumber);
    book.currentPageNumber = pageNumber;
    configureButtonsForPage(pageNumber, book);

    return book;
};

const NextPage = book => {
    if (book.currentPageNumber === book.numberOfPages) {
        return book;
    }

    return GoToPage(book.currentPageNumber + 1, book);
};

const PreviousPage = book => {
    if (book.currentPageNumber === 1) {
        return book;
    }

    return GoToPage(book.currentPageNumber - 1, book);
};

const DrawPages = (panels, drawPage) => {
    return fp.map(drawPage)(panels);
};

const Draw = (theme, drawPage, drawButtons) => {
    var pages = DrawPages(theme.panels, drawPage);
    var buttonLayout = drawButtons(["howToPlayBack", "audioOff", "settings", "howToPlayPrevious", "howToPlayNext"]);

    const pageIsInBook = pageNumber => {
        return pageNumber <= pages.length && pageNumber >= 1;
    };

    let book = {
        destroy: () => {
            fp.map(page => {
                page.destroy();
            })(pages);
            buttonLayout.destroy();
        },
        pages: pages,
        page: pageNumber => pages[pageNumber - 1],
        numberOfPages: pages.length,
        firstPage: pages[0],
        previousPageOption: buttonLayout.buttons["howToPlayPrevious"],
        nextPageOption: buttonLayout.buttons["howToPlayNext"],
        showPage: pageNumber => {
            if (pageIsInBook(pageNumber)) {
                pages[pageNumber - 1].visible = true;
            }
        },
        hidePage: pageNumber => {
            if (pageIsInBook(pageNumber)) {
                pages[pageNumber - 1].visible = false;
            }
        },
    };

    return GoToPage(1, book);
};

const Start = (screenName, theme, game, scene, overlayLayout) => {
    return Draw(theme, Page.Draw(screenName, Scenery.Draw(game, scene)), Button.Draw(scene, overlayLayout));
};

export { Start, Draw, GoToPage, NextPage, PreviousPage };
