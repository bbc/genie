import * as WebFont from "../../node_modules/webfontloader/webfontloader.js";

const REITH_FONT_CSS = "https://gel.files.bbci.co.uk/r2.302/bbc-reith.css";

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
            urls: [REITH_FONT_CSS],
        },
    });
};
