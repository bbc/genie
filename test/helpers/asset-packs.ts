import { assets, objectToJsonDataUrl } from "test/helpers/assets";

const emptyAssetPack = objectToJsonDataUrl({});

const oneScreenOneAssetPack = objectToJsonDataUrl({
    screen: [createImageAsset("image", "one", assets.imgUrlOnePixel, false)],
});

const twoScreensFourAssetsPack = objectToJsonDataUrl({
    screen1: [createImageAsset("image", "darkGreySquare100", assets.darkGreySquare100, false)],
    screen2: [
        createImageAsset("image", "ship", assets.ship, false),
        createImageAsset("image", "greenCircle40", assets.greenCircle40, false),
        createImageAsset("image", "lightGreySquare100", assets.lightGreySquare100, false),
    ],
});

export const assetPacks = {
    emptyAssetPack,
    oneScreenOneAssetPack,
    twoScreensFourAssetsPack,
};

function createImageAsset(type: string, key: string, url: string, overwrite?: boolean) {
    return {
        type,
        key,
        url,
        overwrite,
    };
}
