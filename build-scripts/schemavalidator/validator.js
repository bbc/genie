#!/usr/bin/env node
/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
/*eslint no-console: 0 */

const Ajv = require("ajv");
const fsp = require("fs").promises;
const ajv = new Ajv();

const args = process.argv;

var hasBeenInvalid = false;

// Read[dir/file] are async so it's hard to pinpoint when to throw an exit
// handle the exit instead and throw a non-zero exit if any JSON was invalid
const exitHandle = () => {
    process.exit(hasBeenInvalid ? 1 : 0);
};

process.on("exit", exitHandle.bind(null));

const checkAgainstSchema = async (validate, filepath, data) => {
    const jsonData = JSON.parse(data);
    const valid = validate(jsonData);

    console.log(`======== ${filepath}`);
    if (!valid) {
        console.log("✖ Invalid JSON");
        validate.errors.forEach(item => {
            console.log(`\tJSON SCHEMA:\t${item.schemaPath}`);
            console.log(`\tDATAPATH:\t${item.dataPath}`);
            console.log(`\tMESSAGE:\t${item.message}\n`);
        });
        hasBeenInvalid = true;
        return;
    }
    console.log("✓ Valid JSON\n");
};

const schemaValidation = async (schemaPath, filePaths) => {
    const schema = await fsp.readFile(schemaPath, "utf8").catch(error => {
        console.log(error);
    });
    const validate = ajv.compile(JSON.parse(schema));

    for (const path of filePaths) {
        const file = await fsp.readFile(path);
        checkAgainstSchema(validate, path, file);
    }
};

schemaValidation(args[2], args.slice(3));
