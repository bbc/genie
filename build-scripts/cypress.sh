#!/usr/bin/env bash
set -e

npm install --force
#python build-scripts/licensechecker/licensechecker.py
node ../cypress/support/clearReport.js
npm run cy:headless
node ../cypress/support/createReports.js
