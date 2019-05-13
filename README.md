# Children's BBC - Genie

A modular framework to simplify the construction of children's games.

## To build:

`npm run build` runs `webpack --config build-scripts/webpack.config.js` and creates a bundle in the `output` directory.

`npm run build-watch` runs the above but in watch mode, which picks up changes to the code and rebuilds automatically.

### Visualizer

`npm run build` will also generate a webpage in the output folder with a visual representation of the modules which make up the bundle. This allows us to investigate bundle size issues that may occur in the future.

To see this simply open `output/stats.html` in a browser.

## To view:

`npm start` then navigate to the URL listed in the terminal output.

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

## Sanity Check Mode:

"Sanity Check" mode is a series of screens that make use of Phaser features such as collisions, rotations, tweens etc. It is to ensure that these features are working as intended.

To access "Sanity Check" mode, add the `sanityCheck=true` query string to the URL: http://localhost:8080/?sanityCheck=true.

While in this mode, press `D` on your keyboard to view the Phaser Arcade Physics hitbox over each sprite.

## Documentation:

*   [Notes on Genie Core](https://github.com/bbc/childrens-games-genie/blob/master/docs/notes-on-genie-core.md)
*   [Coding Guidelines](https://github.com/bbc/childrens-games-genie/blob/master/docs/coding-guidelines.md)

## License and Copyright

© BBC 2018.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
