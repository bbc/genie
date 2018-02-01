#!/usr/bin/env bash
set -e

npm install
npm run test
npm run build
