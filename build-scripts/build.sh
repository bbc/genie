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

#Don't create theme 2 for PR builds to save time
if [ "$GIT_BRANCH" = "master" ]
  then npm run build:theme2
fi
npm run build
cp -r themes output/themes
cp -r debug output/debug

set +e
npm run start:pack & npm run cy:local
if [ $? -eq 0 ]
then
    if [ "$GIT_BRANCH" = "master" ]
    then 
        npm run cy:local-theme2
        postTheme2Actions
    else
        node cypress/support/createReports.js
        zip -r output/reports/screenshots.zip cypress/screenshots
        exit 0
    fi  
else
    if [ "$GIT_BRANCH" = "master" ]
    then 
        npm run cy:local-theme2
        postTheme1Actions
    else
        postTheme1Actions
    fi  
fi
