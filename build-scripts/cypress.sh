#!/usr/bin/env bash
set -e

npm install
#python build-scripts/licensechecker/licensechecker.py
npm run cy:headless
node cypress/support/createReports.js
