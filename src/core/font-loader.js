export const loadFonts = game => {
    // --- Hack start ---
    /** Phaser has an issue when attempting to use additional fonts. The first time these fonts are loaded
     *  they will not be rendered and Phaser will then fall back on the default browser font. We can circumvent
     *  this issue by adding some some small non-visible text to the game at startup to force our bold and italic
     *  variants of ReithSans to load before the first screen.
     */
    const regularReithSans = { font: "1px ReithSans" };
    game.add.text(-10000, -10000, ".", regularReithSans);

    const boldReithSans = { font: "bold 1px ReithSans" };
    game.add.text(-10000, -10000, ".", boldReithSans);

    const italicReithSans = { font: "italic 1px ReithSans" };
    game.add.text(-10000, -10000, ".", italicReithSans);

    const italicBoldReithSans = { font: "italic bold 1px ReithSans" };
    game.add.text(-10000, -10000, ".", italicBoldReithSans);
    // --- Hack end ---
};
