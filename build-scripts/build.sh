#!/usr/bin/env bash
set -e

npm install --force
#python build-scripts/licensechecker/licensechecker.py
npm run test
#npm run validate:themes -- default # Validates themes
npm run build
cp -r themes output/themes
cp -r debug output/debug
npm run cy:headless
if [ $? -eq 0 ]
    then
        echo "The script ran ok"
        node cypress/support/createReports.js
        exit 0
    else
        echo "The script failed" >&2
        node cypress/support/createReports.js
        exit 1
fi
