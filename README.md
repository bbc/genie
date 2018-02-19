# GENIE

## To build:

`npm run build` which runs `webpack --config build-scripts/webpack.config.js`
`npm run build-watch` runs the compiler and creates a bundle.


## To view:

`npm start` then navigate to localhost:8080

Alternatively load index.html as a file URL (requires
--allow-file-access-from-files in Chrome.)

## To test:

`npm test` will run tests using karma.  
`npm run test-watch` will run tests using karma in watch mode.  

`npm test:coverage` and `npm run test-watch:coverage` will also calculate test
coverage.  
This will run **slower** than running the tests normally.
