#!/usr/bin/env bash
set -e

nvm install 5.6.0
npm install
npm run test
npm run build
