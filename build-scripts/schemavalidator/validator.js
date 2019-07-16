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

const pathSwitch = {
    theme: names => {
        return names.map(name => "themes/" + name + "/achievements/config.json");
    },
    default: names => names,
};

const args = process.argv;
const option = args[2];
const schema = args[3];
const targets = pathSwitch[option](args.slice(4));

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
        console.log("✖\tInvalid JSON");
        validate.errors.forEach(item => {
            console.log(`\tJSON SCHEMA:\t${item.schemaPath}`);
            console.log(`\tDATAPATH:\t${item.dataPath}`);
            console.log(`\tMESSAGE:\t${item.message}\n`);
        });
        hasBeenInvalid = true;
        return;
    }
    console.log("✓\tValid JSON\n");
};

const schemaValidation = async (schemaPath, filePaths) => {
    schemaPath = "build-scripts/schemavalidator/schemas/" + schemaPath + ".json";
    const schema = await fsp.readFile(schemaPath, "utf8").catch(error => {
        console.log(error);
    });

    console.log(`======== SCHEMA\t${schemaPath}\n\n`);

    const validate = ajv.compile(JSON.parse(schema));

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

if (args.length < 4 || targets.length === 0) {
    console.log("Expected usage:");
    console.log("npm run validate -- <schema> <json path(s)>");
    console.log("npm run validate:themes -- <theme(s)>\n");
    console.log("Example:");
    console.log("With :theme shortcut\t|\tnpm run validate:themes -- default test");
    console.log("Without shortcut\t|\tnpm run validate -- achievement ./themes/default/achievements/config.json\n");
} else {
    schemaValidation(schema, targets);
}
