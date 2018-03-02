# Typescript Build Process

* [Process for Building](#for-building)
* [Process for Testing](#for-testing)
* [Phaser](#phaser)

## For Building

This section explains the build process when `npm run build` is executed.

#### Webpack

The config file for webpack during a normal build is located at `build-scripts/webpack.config.js`.

It is currently set to generate `cheap-module-eval-source-map` source maps.  
The different types of source maps that can be generated are listed [here](https://webpack.js.org/configuration/devtool/).

We currently use HappyPack which helps to speed up **initial** webpack build times.

##### Webpack Loaders

* ts-loader - Compiles our Typescript source code to Javascript. This is ran in HappyPackMode which disables type checking (we run this in a forked process instead).
* script-loader - Executes Javascript code, we use this to run Phaser.
* babel (set to target IE 11) - Polyfills ES6 features.

#### Webpack plugins

* fork-ts-checker-webpack-plugin - Type checks our Typescript source code in a forked process.

### Watch Mode

Watch mode can be started with `npm run build-watch`.

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

#### Importing Phaser

Phaser must be imported in the following order, the following code imports its dependencies first, then imports Phaser. This prevents the `PIXI not found` error from occuring.

```
import "pixi.js";
import "p2";
import "phaser-ce";

export const Phaser = (window as any).Phaser;
export const PIXI = (window as any).PIXI;
export const p2Obj = (window as any).p2;
```
