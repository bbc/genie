# Genie Build Process

## Webpack

The config file for webpack during a normal build is located at `build-scripts/webpack.config.js`.

It is currently set to generate `cheap-module-eval-source-map` source maps in development mode.  

The different types of source maps that can be generated are listed [here](https://webpack.js.org/configuration/devtool/).

### Webpack Loaders

* babel-loader - Transpiles our ES6 source code to IE 11 compatible Javascript.
* webfontloader - A library for loading fonts.

## Watch Mode

Watch mode can be started with `npm start`.  
If developing for IE11 locally, use `npm run start:pack`.

## For Testing

`npm test` runs both jest and eslint.  
`npm run jest` runs jest with coverage enabled.  
`npm run jest:no-coverage` runs jest with coverage disabled.  
The jest configuration file can be found in the root of the repository, it is called `jest.config.js`.
