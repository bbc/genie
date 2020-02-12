# Getting Started With Genie

## What is Genie?

Genie is a modular framework designed to simplify the construction of children's games. It uses [Phaser 3](https://phaser.io/phaser3), an HTML5 game engine.

Genie provides a set of reusable components common to BBC games such as a load screen, select screen, pause, how to play, as well as an implementation of the standard BBC Games GEL UI. This means game developers can focus on creating the gameplay component, as much of the logic surrounding the game has been provided.

## How do I set up my local dev environment?

A skeleton set-up has been included in this starter pack. To install, run `npm install` in the command line. This will pull in the Genie framework.

The game sequence can then be configured by editing: `src/main.js`. Inside `main.js`, Import the desired screens and add them to the `screenConfig` Object. The `routes` object returns a string to indicate the name of the next screen to transition to.

New screens (including the gameplay component) should be created in the `components` folder.

You can preview your game by running a server using `npm start`. It can then be viewed in a browser at http://localhost:8080/ or at the local network address printed in the console. Changes to the source will trigger a rebuild and will refresh the page on all devices currently viewing the page. This command runs the code directly without webpacking it first.

To webpack the code and then run a server, use `npm start:pack`. This command will also add inline sourcemaps (when using Genie 1.0.12 or later).  
Please note to preview your game in IE11 you will need to webpack it first.

The qaMode query string may be added to the end to view the game in QA Mode. This gives additional console output, and if you press "q", you can see the layout overlay. http://localhost:8000/?qaMode=true.

To build your game using Webpack, use `npm run build`.

To check achievements config against the correct scheme use `npm run validate`. *(requires node 10+)*

## ES6 Modules

Code should be packaged as ES6 modules.
See `src\click-progression-game.js` as an example starting point for a game.

## Global Script

Any required global scripts (tools / libs etc) should be loaded via the `globals.json` file in the root.
See `globals.json.example` for how this works.

They can be loaded from `node_modules` folder or otherwise should be placed in a `vendor` folder.

Note that during development the global scripts are loaded on the fly in the index page.
The index page should not be edited to include any scripts as it is not used in the final build process.

## Genie Gel ("GELIE") Documentation

## How can I access support?

There is additional in-depth documentation in the docs folder of this respository and in the Genie Core repository. For further support contact the BBC Project Manager assigned to your game.
