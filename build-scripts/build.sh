#!/usr/bin/env bash
set -e

npm install
node_modules/karma/bin/karma start build-scripts/karma.jenkins.conf.js
npm run build
