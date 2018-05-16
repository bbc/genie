export const loadNavigation = (home, select, game, results) => {
    return {
        "loadscreen": {
            next: home,
        },
        "home": {
            next: select,
        },
        "character-select": {
            next: game,
            home: home,
            restart: home,
        },
        "game": {
            next: results,
            home: home,
            restart: game,
        },
        "results": {
            next: home,
            game: game,
            restart: game,
            home: home,
        },
    };
};
