# Core Documentation

* [Startup](#startup)
* [Context](#context)
* [Screen](#screen)
* [Sequencer](#sequencer)
* [Asset Loader][1]
* [Design Patterns Used](#design-patterns-used)
* [Typescript Build Process][2]

## Startup

This extends `Phaser.State` and creates a new `Phaser.Game`, as well as a new `Sequencer`. It also instantiates the `Context` object.

## Context

This object is passed through the game to provide information about the game's config. It has the GMI (Game Messaging Interface), game state and the sequencer instance on it, and it sets various other properties of the game (e.g. `gameMuted` and `qaMode`).

## Screen

The `Screen` class extends `Phaser.State`, providing the `Context` to objects that extend from it.

## Sequencer

The sequencer provides a way of showing the game screens in the order defined in `main.ts`. It is a singleton, created in `startup.ts` and added to `context.sequencer`. On creation, it adds the screens to the game state, and starts the first one. It also provides a `next()` function to start the next screen.

State can also be passed from screen to screen. The state object has transient or persistent state set on it. Transient state is for storing information about the current game, and persistent state will save the data to local storage. This means that if a player has unlocked certain items in a game, they will be remembered for return visits.

#### Phaser Buttons and Sequence

When adding `this.next()` as a callback on a Phaser Button, `context.inState` can be polluted with the `Phaser.Game` due to the way that Phaser binds `this` to a button. This can be easily avoided by wrapping the call in a function, e.g:

`this.game.add.button(0, 0, this.gel.play, () => this.next(), this))`

instead of:

`this.game.add.button(0, 0, this.gel.play, this.next, this))`

## Design Patterns Used

Modules are created using a variant of the static factory pattern. They are first called using the `create()` method, which will return a singleton with its methods. It is similar to the [revealing module pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

[1]: asset-loader.md
[2]: ts-build.md
