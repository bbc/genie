import "../../node_modules/webfontloader/webfontloader.js";

export const loadFonts = (game, done) => {
    WebFont.load({
        active: () => {
            game.add.text(-10000, -10000, ".", { font: "1px ReithSans" });
            game.add.text(-10000, -10000, ".", { font: "bold 1px ReithSans" });
            game.add.text(-10000, -10000, ".", { font: "italic 1px ReithSans" });
            game.add.text(-10000, -10000, ".", { font: "italic bold 1px ReithSans" });

            done();
        },
        custom: {
            families: ["ReithSans"],
            urls: ["https://nav.files.bbci.co.uk/orbit/2.0.0-245.36c8c84/css/orb-ltr.min.css"]
        }
    });
};


