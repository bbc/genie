#!/usr/bin/env bash
set -e

npm install
curl -O https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip
unzip BrowserStackLocal-linux-x64.zip
chmod 0755 BrowserStackLocal
node_modules/karma/bin/karma start build-scripts/karma.jenkins.conf.js
npm run build
