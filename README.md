# Children's BBC - Genie

A modular framework to simplify the construction of children's games.

## To build:

`npm run build` runs `webpack --config build-scripts/webpack.config.js`

`npm run build-watch` runs the compiler and creates a bundle. This means you can view index.html in a browser without having to run a webserver.

## To view:

`npm start` then navigate to http://localhost:8080/

Alternatively load http://localhost:8080/index.html as a file URL (requires `--allow-file-access-from-files` in Chrome.)

## To test:

`npm test` will run tests using karma.

`npm run test-watch` will run tests using karma in watch mode.

`npm run test:coverage` and `npm run test-watch:coverage` will calculate test coverage. This runs more **slowly** than running the tests normally.

## Creating a new version for release:

To automatically bump the package version and create a corresponding Github release tag, use the following command (please replace `patch` with `minor` or `major` as required):

```
npm version patch -m "Write your release notes here"
```

Then push to Github to see the new version appear.

(Please note you will need to create a branch, rather than doing this directly on master, as master is currently protected.)

## Code linting:

`npm run eslint` runs [ESLint](https://eslint.org/).

## Auto documentation:

`npm run docs` opens the documentation.

`npm run gendocs` generates documentation using [JSDoc](https://usejsdoc.org/) and outputs to `docs/api/index.html`.

## QA Mode:

To access QA mode, add the `qaMode=true` query string to the URL: http://localhost:8080/?qaMode=true

This will output game loading progress and asset keylookups to the console. Pressing "q" will show the layout overlay, to show the game bounds.

## Documentation:

*   [Notes on Genie Core](https://github.com/bbc/childrens-games-genie/blob/master/docs/notes-on-genie-core.md)
*   [Coding Guidelines](https://github.com/bbc/childrens-games-genie/blob/master/docs/coding-guidelines.md)
