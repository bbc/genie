#!/usr/bin/env bash
set -e

npm install
npm test
npm run build
