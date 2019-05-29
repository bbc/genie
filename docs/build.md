# Typescript Build Process

* [Process for Building](#for-building)
* [Process for Testing](#for-testing)
* [Phaser](#phaser)

## For Building

This section explains the build process when `npm run build` is executed.

#### Webpack

The config file for webpack during a normal build is located at `build-scripts/webpack.config.js`.

It is currently set to generate `source-map` source maps.
The different types of source maps that can be generated are listed [here](https://webpack.js.org/configuration/devtool/).

##### Webpack Loaders

* babel-loader - Transpiles our ES6 source code to IE 11 compatible Javascript.
* expose-loader - This exposes Phaser as a module in our bundle.

### Watch Mode

Watch mode can be started with `npm run build:watch`.

In watch mode, webpack is simply ran with the same config file, but with the `--watch` flag.

## For Testing

This section explains the build process when `npm run test` is executed.
The karma configuration file can be found at `test/karma.conf.js`.

#### Watch Mode

Watch mode can be started with `npm run test-watch`.

In watch mode, karma is ran with the additional `--no-single-run --auto-watch` flags.

The `--no-single-run` allows karma to run the tests more than once.

#### Coverage Mode

Coverage mode can be started with `npm run test:coverage` or `npm run test-watch:coverage`.

The config file for webpack during a build that requires coverage, is located at `test/coverage.webpack.config.js`.

This config file is almost the same as the normal build one, except it adds an extra plugin called `istanbul-instrumenter-loader` which calculates coverage.

We also are using the `--max_old_space_size=4096` node option, as this requires a lot of memory, because it is remapping the coverage back to our Typescript source files.

## Phaser

#### Resolving Phaser

For Phaser 2, we need to create aliases so that Phaser and it's dependencies load properly using Webpack. These are defined in Webpack's config file.

These modules are resolved to the following paths:

```
"phaser-ce": ../node_modules/phaser-ce/build/custom/phaser-split.js,
"pixi.js": ../node_modules/phaser-ce/build/custom/pixi.js,
p2: ../node_modules/phaser-ce/build/custom/p2.js,
```
