#!/usr/bin/env bash
set -e

npm install
# npm run tslint TODO - ESlint here
npm run test:coverage
npm run build
