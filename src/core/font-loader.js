export const loadFonts = (addText, done) => {
    WebFont.load({
        active: () => {
            const boldReithSans = { font: "bold 1px ReithSans" };
            addText(10000, 10000, ".", boldReithSans);
    
            const italicReithSans = { font: "italic 1px ReithSans" };
            addText(-10000, -10000, ".", italicReithSans);
    
            done();
        },
        custom: {
            families: ["ReithSans"],
            urls: ["../../fonts/fonts.css"],
        },
    });

}
