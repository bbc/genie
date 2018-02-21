#!/usr/bin/env bash
set -e

npm install
npm run tslint
npm run test:coverage
npm run build
