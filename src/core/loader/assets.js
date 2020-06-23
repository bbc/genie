/**
 * @module core/loader/assets
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import pako from "pako";
import untar from "js-untar";
import { gmi } from "../gmi/gmi.js";

export const download = () =>
    fetch(gmi.gameDir + gmi.embedVars.configPath + "archive.tgz", {
        mode: "no-cors",
    })
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => pako.ungzip(new Uint8Array(arrayBuffer)))
        .then(decoded => untar(decoded.buffer));
