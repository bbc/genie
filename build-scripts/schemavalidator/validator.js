#!/usr/bin/env node
const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');
const ajv = new Ajv();

const rootThemeFolder = './themes/';
const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Achievements",
    "description": "A list of achievements",
    "type": "array",
    "minItems": 1,
    "items": {
        "type": "object",
        "properties": {
            "key": {
                "type": "string",
                "pattern": "^[a-zA-Z0-9_]*$",
            },
            "name": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "points": {
                "type": "integer",
                "minimum": 0
            },
            "additional": {
                "type": "object",
                "properties": {
                    "prefix": {
                        "type": "string"
                    },
                    "text": {
                        "type": "string"
                    }
                },
                "required": [
                    "prefix",
                    "text"
                ]
            },
            "maxProgress": {
                "type": "integer"
            }
        },
        "required": [
            "key",
            "name",
            "description",
            "points"
        ]
    }
};

const validate = ajv.compile(schema);
var hasBeenInvalid = false;

const validateSchema = (filepath) => {
    return (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        const jsonData = JSON.parse(data);
        const valid = validate(jsonData);

        console.log(`======== ${filepath}`)
        if (!valid) {
            console.log(`✖ Invalid JSON`);
            validate.errors.forEach((item) => {
                console.log(`\tJSON SCHEMA:\t${item.schemaPath}`);
                console.log(`\tDATAPATH:\t${item.dataPath}`);
                console.log(`\tMESSAGE:\t${item.message}\n`);
            });
            hasBeenInvalid = true;
            return;
        }
        console.log(`✓ Valid JSON\n`);
    }
}

// Read[dir/file] are async so it's hard to pinpoint when to throw an exit
// handle the exit instead and throw a non-zero exit if any JSON was invalid
const exitHandle = () => {
    process.exit(hasBeenInvalid ? 1 : 0);
}

process.on('exit', exitHandle.bind(null));

fs.readdir(rootThemeFolder, { withFileTypes: true }, (err, files) => {
    if(err) {
        console.log(err);
        return;
    }
    files.forEach(file => {
        if(file.isDirectory) {
            const filePath = path.join(rootThemeFolder, file.name, "achievements", "config.json");
            fs.readFile(filePath, validateSchema(filePath));
        }
    });
});