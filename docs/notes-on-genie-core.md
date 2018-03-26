# Notes on Genie Core

* [Context](#context)
* [Phaser Buttons and Sequence](#phaser-buttons-and-sequence)
* [Design Patterns Used](#design-patterns-used)


## Context

This object is passed through the game to provide information about the game's config. It has the GMI (Game Messaging Interface), game state and the sequencer instance on it, and it sets various other properties of the game (e.g. `gameMuted` and `qaMode`).


#### Phaser Buttons and Sequence

When adding `this.next()` as a callback on a Phaser Button, `context.inState` can be polluted with the `Phaser.Game` due to the way that Phaser binds `this` to a button. This can be easily avoided by wrapping the call in a function, e.g:

`this.game.add.button(0, 0, this.gel.play, () => this.next(), this))`

instead of:

`this.game.add.button(0, 0, this.gel.play, this.next, this))`

## Design Patterns Used

Modules are created using a variant of the static factory pattern. They are first called using the `create()` method, which will return a singleton with its methods. It is similar to the [revealing module pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

[1]: asset-loader.md
