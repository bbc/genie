#!/usr/bin/env node
const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');
const ajv = new Ajv();

var hasBeenInvalid = false;

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

const rootThemeFolder = './themes/';
const validate = ajv.compile(schema);

const validateSchema = (filepath) => {
    return (err, data) => {
        const jsonData = JSON.parse(data);
        const valid = validate(jsonData);
    
        if (!valid) {
            console.log(`✖ Invalid JSON:\t${filepath}`);
            validate.errors.forEach((item) => {
                console.log(`\tJSON SCHEMA:\t${item.schemaPath}`);
                console.log(`\tDATAPATH:\t${item.dataPath}`);
                console.log(`\tMESSAGE:\t${item.message}\n`);
            });
            hasBeenInvalid = true;
            return;
        }
        console.log(`✓ Valid JSON: \t${filepath}`);
    }
}

fs.readdir(rootThemeFolder, { withFileTypes: true }, (err, files) => {
    files.forEach(file => {
        if(file.isDirectory) {
            const filePath = path.join(rootThemeFolder, file.name, "achievements", "config.json");
            fs.readFile(filePath, validateSchema(filePath));
        }
    });
});

console.log(hasBeenInvalid);

if (hasBeenInvalid) {
    console.log("ERROR");
    process.exit(1);
}