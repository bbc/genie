/**
 * @module core/loader/assets
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import pako from "pako";
import untar from "js-untar";
import { gmi } from "../gmi/gmi.js";

let assets = [];

export const download = async () => {
    const buffer = await fetch(gmi.gameDir + gmi.embedVars.configPath + "archive.tgz", {
        mode: "no-cors",
    }).then(response => response.arrayBuffer());
    const raw = new Uint8Array(buffer);
    const decoded = await pako.ungzip(raw);
    assets = untar(decoded.buffer);
    return assets;
};

export const getAsset = path => assets.filter(asset => asset.name === path).pop();
