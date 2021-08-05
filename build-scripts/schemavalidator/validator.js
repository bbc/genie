#!/usr/bin/env node
/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
/*eslint no-console: 0 */

const Ajv = require("ajv");
const path = require("path");
const fsp = require("fs").promises;
const ajv = new Ajv();

var hasBeenInvalid = false;

// Read[dir/file] are async so it's hard to pinpoint when to throw an exit
// handle the exit instead and throw a non-zero exit if any JSON was invalid
const exitHandle = () => {
	process.exit(hasBeenInvalid ? 1 : 0);
};

process.on("exit", exitHandle.bind(null));

const loadThemeConfigs = async () => {
	await fsp
		.readdir("themes", { withFileTypes: true })
		.catch(err => {
			if (err.code === "ENOENT") {
				console.log("✖\tThemes folder doesn't exist\n");
			} else {
				console.log(err);
			}
			process.exit(1);
		})
		.then(themes => {
			themes = themes
				.filter(theme => theme.isDirectory)
				.map(theme => path.join("themes", theme.name, "achievements", "config.json"));

			loadFiles(schema, themes);
		});
};

const checkAgainstSchema = async (validate, filepath, data) => {
	let jsonData;
	try {
		jsonData = JSON.parse(data);
	} catch (error) {
		console.log(`======== ${filepath}`);
		console.log("✖\tUnparsable JSON!");
		console.log(`✖\t${error.toString()}\n`);
		return;
	}
	const valid = validate(jsonData);

	console.log(`======== ${filepath}`);
	if (!valid) {
		console.log("✖\tJSON not valid to schema");
		validate.errors.forEach(item => {
			console.log(`\tJSON schema:\t${item.schemaPath}`);
			console.log(`\tData path:\t${item.dataPath}`);
			console.log(`\tMessage:\t${item.message}\n`);
		});
		hasBeenInvalid = true;
		return;
	}
	console.log("✓\tJSON valid to schema\n");
};

const loadFiles = async (schemaPath, filePaths) => {
	schemaPath = "build-scripts/schemavalidator/schemas/" + schemaPath + ".json";
	const schema = await fsp.readFile(schemaPath, "utf8").catch(error => {
		if (error.code === "ENOENT") {
			console.log(`\n✖\tSchema doesn't exist under ${schemaPath}, are you sure this is correct?`);
		} else {
			console.log(error);
		}
		process.exit(1);
	});

	console.log(`USING SCHEMA\t${schemaPath}\n\n`);

	let jsonSchema;

	try {
		jsonSchema = JSON.parse(schema);
	} catch (error) {
		console.log(`Incapable of loading schema at ${schema}. Bailing out.`);
		process.exit(1);
	}

	const validate = ajv.compile(jsonSchema);

	for (const path of filePaths) {
		const file = await fsp.readFile(path).catch(error => {
			console.log(`======== ${path}`);
			if (error.code === "ENOENT") {
				console.log(`✖\tTheme doesn't exist under ./themes/${path}, are you sure this is correct?`);
			} else {
				console.log(error);
			}
		});
		checkAgainstSchema(validate, path, file);
	}
};

const args = process.argv;
const schema = args[2];

loadThemeConfigs(args.slice(3));
