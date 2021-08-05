#!/usr/bin/env node
/* eslint-disable */
/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 *
 * Coverts Phaser 2 asset packs to Phaser 3
 *
 * Usage: node repack path-to-file
 */
// constants
const brightRed = "\x1b[1m\x1b[31m";
const brightGreen = "\x1b[1m\x1b[32m";
const resetCli = "\x1b[0m";
const fs = require("fs");
const path = require("path");

// functions
const getNewPath = ({ dir, ext, name }) => ({ dir, ext, name: name + "_new" });
const isP3Format = json => Object.keys(json).some(key => Boolean(json[key].prefix) || Boolean(json[key].files));
const exitWithMessage = (color, text, code) => {
	console.log(color, text);
	console.log(resetCli);
	process.exit(code);
};

const audio = entry => {
	entry.url = entry.urls.find(value => /\.(mp3|mp4)$/i.test(value));
	delete entry.urls;
	delete entry.autoDecode;
	return entry;
};

const isDefined = value => value !== undefined;
const spriteParams = ["frameWidth", "frameHeight", "margin", "spacing", "startFrame", "endFrame"];

const spritesheet = entry => {
	const entries = spriteParams.map(param => [param, entry[param]]).filter(a => isDefined(a[1]));
	entry.frameConfig = Object.fromEntries(entries);
	[...spriteParams, "frameMax"].forEach(param => delete entry[param]);
	return entry;
};

const bitmapFont = entry => {
	entry.fontDataURL = entry.atlasURL;
	delete entry.atlasURL;

	return entry;
};

const defaultFile = entry => entry;

const dispatcher = {
	audio,
	spritesheet,
	bitmapFont,
	defaultFile,
};

const updateFiles = entry => dispatcher?.[entry.type]?.(entry) || dispatcher.defaultFile(entry);

// Open and process file
const file = process.argv[2];
if (!fs.existsSync(file)) exitWithMessage(brightRed, `ERROR: File ${file} not found!`, 1);

let oldManifest = JSON.parse(fs.readFileSync(file));

if (isP3Format(oldManifest)) exitWithMessage(brightRed, `ERROR: File ${file} is already Phaser 3 format!`, 1);

const keys = Object.keys(oldManifest);
const values = keys.map(key => ({ prefix: `${key}.`, files: oldManifest[key].map(updateFiles) }));
const newManifest = keys.reduce((obj, k, i) => ({ ...obj, [k]: values[i] }), {});
//const newFile = path.format(getNewPath(path.parse(file)));

fs.writeFileSync(file, JSON.stringify(newManifest, null, 4));

//console.log(JSON.stringify(newManifest, null, 4))

exitWithMessage(brightGreen, `File written to ${file}`, 0);
