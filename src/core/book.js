import * as _ from "lodash/fp";

const GoToPage = (pageNumber, book) => {
    if (pageNumber > book.numberOfPages) {
        return book;
    }

    book.showPage(pageNumber);
    book.currentPageNumber = pageNumber;

    if (pageNumber >= 1 && book.numberOfPages >= pageNumber) {
        book.nextPageOption.visible = book.numberOfPages > pageNumber;
        book.previousPageOption.visible = pageNumber > 1;
    }

    return book;
};

const NextPage = book => {
    book.hidePage(book.currentPageNumber);
    return GoToPage(book.currentPageNumber + 1, book);
};

const PreviousPage = book => {
    book.hidePage(book.currentPageNumber);
    return GoToPage(book.currentPageNumber - 1, book);
};

const DrawPages = (panels, drawPage) => {
    return _.map(drawPage)(panels);
};

const Draw = (theme, drawPage, drawButtons) => {
    var pages = DrawPages(theme.panels, drawPage);
    var buttonLayout = drawButtons(["Previous", "Next"]);

    let book = {
        page: pageNumber => pages[pageNumber - 1],
        numberOfPages: pages.length,
        firstPage: pages[0],
        previousPageOption: buttonLayout.buttons["Previous"],
        nextPageOption: buttonLayout.buttons["Next"],
        showPage: pageNumber => (pages[pageNumber - 1].visible = true),
        hidePage: pageNumber => (pages[pageNumber - 1].visible = false),
    };

    return GoToPage(1, book);
};

export { Draw, GoToPage, NextPage, PreviousPage };
