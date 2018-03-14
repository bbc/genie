import { assets, objectToJsonDataUrl } from "./assets";

const emptyAssetPack = objectToJsonDataUrl({ empty: {} });

const loadscreenPack = objectToJsonDataUrl({
    loadscreen: [createImageAsset("image", "greenCircle40", assets.greenCircle40, false)],
});
const oneScreenOneAssetPack = objectToJsonDataUrl({
    screen: [createImageAsset("image", "one", assets.imgUrlOnePixel, false)],
});

const twoScreensThreeAssetsPack = objectToJsonDataUrl({
    screen1: [createImageAsset("image", "darkGreySquare100", assets.darkGreySquare100, false)],
    screen2: [
        createImageAsset("image", "ship", assets.ship, false),
        createImageAsset("image", "lightGreySquare100", assets.lightGreySquare100, false),
    ],
});

const gelButtonAssetPack = objectToJsonDataUrl({
    gel: [
        createImageAsset("image", "gel/desktop/play.png", assets.darkGreySquare100, false),
        createImageAsset("image", "gel/mobile/play.png", assets.darkGreySquare100, false),
    ],
});

export const assetPacks = {
    emptyAssetPack,
    loadscreenPack,
    oneScreenOneAssetPack,
    twoScreensThreeAssetsPack,
    gelButtonAssetPack,
};

function createImageAsset(type, key, url, overwrite) {
    return {
        type,
        key,
        url,
        overwrite,
    };
}
