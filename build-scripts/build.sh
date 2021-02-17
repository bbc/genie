#!/usr/bin/env bash

postTheme2Actions()
{
     if [ $? -eq 0 ]
            then
                node cypress/support/createReports.js
                zip -r output/reports/screenshots.zip cypress/screenshots
                exit 0
            else
                echo "The Cypress tests failed - Uploading report to S3 with no latest" >&2
                node cypress/support/createReports.js
                zip -r output/reports/screenshots.zip cypress/screenshots
                $UPLOADTOS3 nolatest
                exit 1
        fi
}

postTheme1Actions()
{
   if [ $? -eq 0 ]
            then
                echo "The Cypress tests failed - Uploading report to S3 with no latest" >&2
                node cypress/support/createReports.js
                zip -r output/reports/screenshots.zip cypress/screenshots
                $UPLOADTOS3 nolatest
                exit 1
            else
                echo "The Cypress tests failed - Uploading report to S3 with no latest" >&2
                node cypress/support/createReports.js
                zip -r output/reports/screenshots.zip cypress/screenshots
                $UPLOADTOS3 nolatest
                exit 1
        fi  
}

set -e 
source /etc/profile
nvm install 12.19.0
node -v
npm install --force
#python build-scripts/licensechecker/licensechecker.py
npm run test
#npm run validate:themes -- default # Validates themes
npm run build
cp -r themes output/themes
cp -r debug output/debug

set +e
npm run start:pack & npm run cy:local
if [ $? -eq 0 ]
    then
        npm run cy:local-theme2
        postTheme2Actions
    else
        npm run cy:local-theme2
        postTheme1Actions
fi

