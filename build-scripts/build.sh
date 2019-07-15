#!/usr/bin/env bash
set -e

npm install --force
python build-scripts/licensechecker/licensechecker.py
npm run test
#npm run validate:themes --  ./themes/*/achievements/config.json # Validates themes
npm run build
cp -r themes output/themes
