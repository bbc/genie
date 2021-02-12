#!/usr/bin/env bash
set -e

npm install --force
#python build-scripts/licensechecker/licensechecker.py
npm run test
#npm run validate:themes -- default # Validates themes
npm run build
cp -r themes output/themes
cp -r debug output/debug
npm run cy:headless || exit
node cypress/support/createReports.js
