#!/usr/bin/env bash
set -e

npm install --force
#python build-scripts/licensechecker/licensechecker.py
DEBUG=cypress:*
node cypress/support/clearReports.js
npm run cy:headless
node cypress/support/createReports.js
