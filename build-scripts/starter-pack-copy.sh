#!/bin/bash
set -e
echo "Starter pack copy script executed from: ${PWD}"
echo "Removing files in ${PWD}/docs"
rm -rf docs/*
echo "Copying ${PWD}/node_modules/genie/docs to ${PWD}/docs"
cp -R node_modules/genie/docs/* docs
echo "Removing files in ${PWD}/themes"
rm -rf themes/*
echo "Copying ${PWD}/node_modules/genie/themes to ${PWD}/themes"
cp -R node_modules/genie/themes/* themes
echo "Commiting updated docs and theme config to develop branch."
git add docs/*
git add themes/*
git status
git commit -m "Documentation and theme config updated."
echo "Starter pack copy script ran successfully."