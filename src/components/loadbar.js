export const createLoadBar = (game, barBgKey, barFillKey) => {
    const loadBar = new Phaser.Group(game);

    // create bar background
    const barBg = game.add.image(0, 0, barBgKey);
    barBg.anchor.add(0.5, 0.5);
    loadBar.addChild(barBg);

    // create progress bar
    loadBar.barFill = game.add.image(0, 0, barFillKey);
    loadBar.barWidth = loadBar.barFill.width;
    loadBar.barFill.x = -loadBar.barFill.width / 2;
    loadBar.barFill.anchor.add(0, 0.5);
    const cropRect = new Phaser.Rectangle(0, 0, loadBar.barWidth, loadBar.barFill.height);
    loadBar.barFill.crop(cropRect, false);
    loadBar.addChild(loadBar.barFill);

    // create setter function and return the phaser object
    loadBar.setFillPercent = percent => {
        const cropRect = new Phaser.Rectangle(0, 0, loadBar.barWidth * percent / 100, loadBar.barFill.height);
        loadBar.barFill.crop(cropRect);
    };
    loadBar.setFillPercent(0);

    return loadBar;
};
