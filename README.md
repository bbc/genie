# GENIE

## To build:

`npm run build` which runs `webpack --config build-scripts/webpack.config.js`
`npm run build-watch` runs the compiler and creates a bundle. This means you can view index.html in a browser without having to run a webserver.


## To view:

`npm start` then navigate to localhost:8080

Alternatively load index.html as a file URL (requires
--allow-file-access-from-files in Chrome.)

## Watcher:

`npm run watch` will run webpack in watch mode.

Typescript files are compiled and bundled automatically on save, while the
watcher is active. Karma tests are also automatically ran.

## To test:

`npm test` will run tests using karma.

### Potential Issues
If you have an error running tests similar to: 
```
 Error during loading "D:\Work\childrens-games-genie\node_modules/karma-phantomjs-launcher" plugin:
  Path must be a string. Received null
```
The prebuilt phantom binaries may have failed to download (this can happen if the network proxy has blocked it for any reason)

To rectify this navigate to: ```node_modules/phantomjs-prebuilt``` and run: ```node install.js```
