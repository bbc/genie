/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import zlib from "zlib"; // for gzip
import fs from "fs";

const gameFolder = "./output/";
const shouldCompress = name =>
    name.endsWith(".js") ||
    name.endsWith(".css") ||
    name.endsWith(".html") ||
    name.endsWith(".json") ||
    name.endsWith(".json5");
const options = {
    params: {
        [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        [zlib.constants.BROTLI_PARAM_LGWIN]: 12,
    },
};

const getFiles = async (path = "./") => {
    const entries = fs.readdirSync(path, { withFileTypes: true });

    const files = entries.filter(file => !file.isDirectory()).map(file => ({ ...file, path: path + file.name }));

    const folders = entries.filter(folder => folder.isDirectory());

    for (const folder of folders) files.push(...(await getFiles(`${path}${folder.name}/`)));

    return files;
};

const compress = path => {
    const file = fs.readFileSync(path);
    brotliCompress(file, path);
    gzipCompress(file, path);
};

const brotliCompress = (file, path) => {
    const compressedFile = zlib.brotliCompress(file, options, () => {
        fs.writeFile(path + ".br", compressedFile, err => {
            if (err) console.log(err);
        });
        console.log(`Wrote: ${path}.br`);
    });
};

const gzipCompress = (file, path) => {
    const compressedFile = zlib.gzip(file, () => {
        fs.writeFile(path + ".gz", compressedFile, err => {
            if (err) console.log(err);
        });
        console.log(`Wrote: ${path}.gz`);
    });
};

getFiles(gameFolder)
    .then(files => files.filter(file => shouldCompress(file.name)))
    .then(files => files.forEach(file => compress(file.path)));
