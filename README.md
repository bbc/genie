# GENIE

## To build:

`npm run build` which runs `webpack --config build-scripts/webpack.config.js`

## To view:

`npm start` then navigate to localhost:8080

Alternatively load index.html as a file URL (requires
--allow-file-access-from-files in Chrome.)

## Watcher:

`npm run watch` will run webpack in watch mode.

Typescript files are compiled and bundled automatically on save, while the
watcher is active.

## To test:

`npm test` will run tests using karma.
