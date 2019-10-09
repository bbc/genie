/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const loadPack = {
    prefix: "loader.",
    files: [
        {
            type: "image",
            key: "title",
            url: "loader/title.png",
            overwrite: false,
        },
        {
            type: "image",
            key: "background",
            url: "loader/background.png",
            overwrite: false,
        },
        {
            type: "image",
            key: "brandLogo",
            url: "loader/brand-logo.png",
            overwrite: false,
        },
        {
            type: "image",
            key: "loadbarBackground",
            url: "loader/load-bar-bg.png",
            overwrite: false,
        },
        {
            type: "image",
            key: "loadbar",
            url: "loader/load-bar-fill.png",
            overwrite: false,
        },
        {
            type: "audio",
            key: "backgroundMusic",
            urls: ["shared/background-music.mp3", "shared/background-music.ogg"],
            autoDecode: true,
        },
        {
            type: "audio",
            key: "backgroundMusicTwo",
            urls: ["shared/background-music-2.mp3", "shared/background-music-2.ogg"],
            autoDecode: true,
        },
        {
            type: "audio",
            key: "buttonClick",
            urls: ["shared/button-click.mp3", "shared/button-click.ogg"],
            autoDecode: true,
        },
    ],
};
