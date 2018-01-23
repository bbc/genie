import { assets, objectToJsonDataUrl } from "test/helpers/assets";

const emptyAssetPack = objectToJsonDataUrl({});

const oneScreenOneAssetPack = objectToJsonDataUrl({
    screen1: [
        {
            type: "image",
            key: "one",
            url: assets.imgUrlOnePixel,
            overwrite: false,
        },
    ],
});

const twoScreensFourAssetsPack = objectToJsonDataUrl({
    screen1: [
        {
            type: "image",
            key: "imgUrlOnePixel",
            url: assets.imgUrlOnePixel,
            overwrite: false,
        },
    ],
    screen2: [
        {
            type: "image",
            key: "ship",
            url: assets.ship,
            overwrite: false,
        },
        {
            type: "image",
            key: "greenCircle40",
            url: assets.greenCircle40,
            overwrite: false,
        },
        {
            type: "image",
            key: "lightGreySquare100",
            url: assets.lightGreySquare100,
            overwrite: false,
        },
    ],
});

export const assetPacks = {
    emptyAssetPack,
    oneScreenOneAssetPack,
    twoScreensFourAssetsPack,
};
