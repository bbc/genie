export const loadNavigation = (home, select, gamescreen, results) => {
    return {
        "loadscreen": {
            next: home,
        },
        "home": {
            next: select,
        },
        "character-select": {
            next: gamescreen,
            home: home,
            restart: home,
        },
        "game": {
            next: results,
            home: home,
            restart: gamescreen,
        },
        "results": {
            next: home,
            game: gamescreen,
            restart: gamescreen,
            home: home,
        },
    };
};
