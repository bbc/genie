#!/usr/bin/env bash
set -e

npm install
npm run test:coverage
npm run build-prod
