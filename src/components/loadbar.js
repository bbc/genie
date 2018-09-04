/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const createLoadBar = (game, barBgKey, barFillKey) => {
    const loadBar = new Phaser.Group(game);

    // create bar background
    const barBg = game.add.image(0, 0, barBgKey);
    barBg.anchor.add(0.5, 0.5);
    loadBar.addChild(barBg);

    // create progress bar
    const barFill = game.add.image(0, 0, barFillKey);
    const barWidth = barFill.width;
    barFill.x = -barFill.width / 2;
    barFill.anchor.add(0, 0.5);
    const cropRect = new Phaser.Rectangle(0, 0, 0, barFill.height);
    barFill.crop(cropRect, false);
    loadBar.addChild(barFill);

    let _fillPercent = 0;
    Object.defineProperty(loadBar, "fillPercent", {
        get: () => {
            return _fillPercent;
        },
        set: percent => {
            cropRect.width = barWidth * percent / 100;
            barFill.crop(cropRect);
            _fillPercent = percent;
        },
    });

    return loadBar;
};
