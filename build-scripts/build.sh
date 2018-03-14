#!/usr/bin/env bash
set -e

npm install
npm run eslint
npm run test:coverage
npm run build
