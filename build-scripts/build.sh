#!/usr/bin/env bash
set -e

npm install
npm run tslint
npm run test
npm run build
