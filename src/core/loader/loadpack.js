/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const getAsset = (path, assets) =>
    assets
        .filter(asset => asset.name === path)
        .pop()
        .getBlobUrl();

export const loadPack = assets => ({
    prefix: "loader.",
    files: [
        {
            type: "image",
            key: "title",
            url: getAsset("./loader/title.png", assets),
        },
        {
            type: "image",
            key: "background",
            url: getAsset("./loader/background.png", assets),
        },
        {
            type: "image",
            key: "brandLogo",
            url: getAsset("./loader/brand-logo.png", assets),
        },
        {
            type: "image",
            key: "loadbarBackground",
            url: getAsset("./loader/load-bar-bg.png", assets),
        },
        {
            type: "image",
            key: "loadbar",
            url: getAsset("./loader/load-bar-fill.png", assets),
        },
        {
            type: "audio",
            key: "buttonClick",
            url: { url: getAsset("./shared/button-click.mp4" , assets), type: "mp4" },
        },
    ],
});
