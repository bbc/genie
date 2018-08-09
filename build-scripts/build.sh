#!/usr/bin/env bash
set -e

npm install --force
python build-scripts/licensechecker/licensechecker.py
npm run test:coverage
npm run build
cp -r themes output/themes
