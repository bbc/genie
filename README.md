# GENIE

## To build:

`npm run build` runs `webpack --config build-scripts/webpack.config.js`

`npm run build-watch` runs the compiler and creates a bundle. This means you can view index.html in a browser without having to run a webserver.

## To view:

`npm start` then navigate to http://localhost:8080/

Alternatively load http://localhost:8080/index.html as a file URL (requires `--allow-file-access-from-files` in Chrome.)

## To test:

`npm test` will run tests using karma. 

`npm run test-watch` will run tests using karma in watch mode.  

`npm test:coverage` and `npm run test-watch:coverage` will calculate test coverage. This runs more **slowly** than running the tests normally.

## QA Mode:

To access QA mode, add the `qaMode=true` query string to the URL: http://localhost:8080/?qaMode=true

This will output game loading progress and asset keylookups to the console. Pressing "q" will show the layout overlay, to show the game bounds.

## Documentation:
* [Genie Core Doucmentation][1]
* [Coding Guidelines][2]

[1]: docs/core.md
[2]: docs/coding-guidelines.md
