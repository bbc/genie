# BBC Games - Genie

A modular framework to simplify the construction of children's games.

## To view:

`npm run start` then navigate to the URL listed in the terminal output.

## To build:

`npm run build` runs `webpack --config build-scripts/webpack.config.js` and creates a bundle in the `output` directory.
This is the the build script that will be used by CI. It will also automatically generate theme 2.

## To automatically generate theme 2

`npm run create-theme2` will copy the `default` theme to the `theme2` folder, and make all the images greyscale so you can easily see the difference between the themes. You can then access it on http://localhost:9000/?theme=theme2

### Visualizer

`npm run build` will also generate a webpage in the output folder with a visual representation of the modules which make up the bundle. This allows us to investigate bundle size issues that may occur in the future.

## Testing builds
`npm run start:pack` then navigate to the URL listed in the terminal output. Creates a final build then serves it locally.

To see this simply open `output/stats.html` in a browser.

Alternatively load http://localhost:9000/index.html as a file URL (requires `--allow-file-access-from-files` in Chrome.)

## To test:

`npm test` will run tests using [Jest](https://jestjs.io/) and check them with ESLint.

`npm run jest` runs the unit tests only.

## To test using Cypress

`npm run start:pack` will create a locally hosted build. In a new terminal running `npm run cy:local` will run the cypress tests against the locally hosted build

`npm run cy:headless` will run the cypress tests against a deployed Test url.

`npm run cy:terminal` will launch the cypress terminal. From here you can pick which suites execute. Useful for developing cypress tests. 
`npm run cy:terminal:local` will also launch the cypress terminal, however this is reliant on `npm run start:pack` as it will connect to the local hosted URL.

## Code linting:

`npm run eslint` runs [ESLint](https://eslint.org/).

## Auto documentation:

`npm run docs` generates documentation using [JSDoc](https://usejsdoc.org/) and outputs to `docs/api/index.html`.

## Debug Mode:

To access debug mode, add the `debug=true` query string to the URL: http://localhost:9000/?debug=true

This will output game loading progress and asset keylookups to the console. Pressing "q" will show the layout overlay, to show the game bounds.

## Documentation:

*   [Getting Started](https://github.com/bbc/genie/blob/master/docs/getting-started.md)
*   [Coding Guidelines](https://github.com/bbc/genie/blob/master/dev/docs/coding-guidelines.md)

## License and Copyright

© BBC 2020.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
