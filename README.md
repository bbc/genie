# GENIE

## To build:

`npm run build` which runs `webpack --config build-scripts/webpack.config.js`

## Build watch:

`npm run build-watch` will automatically compile the Typescript and run a webpack build when the code is changed. Running this means you can view index.html in a browser without having to run a webserver.

## To view:

`npm start` then navigate to http://localhost:8080/

Alternatively load index.html as a file URL (requires --allow-file-access-from-files in Chrome.)

To view in QA mode, add the query string "qaMode=true", then press the "q" key to see the layout overlay. (e.g. http://localhost:8080/?qaMode=true). This will also output information to the console.


## To test:

`npm test` will run tests using karma.

`npm run test-watch` will run tests using karma in watch mode (it will automatically re-run the tests when either the production code or the tests are modified).

`npm test:coverage` and `npm run test-watch:coverage` will also calculate test coverage. This will run **slower** than running the tests normally.

### Potential Issues

If you have an error running tests similar to: 
```
 Error during loading "D:\Work\childrens-games-genie\node_modules/karma-phantomjs-launcher" plugin:
  Path must be a string. Received null
```
The prebuilt phantom binaries may have failed to download (this can happen if the network proxy has blocked it for any reason).

To rectify this navigate to: ```node_modules/phantomjs-prebuilt``` and run: ```node install.js```.
