# Notes on Genie Core

* [Context](#context)
* [Design Patterns Used](#design-patterns-used)


## Context

This object is passed through the game to provide information about the game's config. It contains the GMI (Game Messaging Interface) and the game state amongst other things. It also sets various properties of the game (e.g. `gameMuted` and `qaMode`).


## Design Patterns Used

Modules are created using a variant of the static factory pattern. They are first called using the `create()` method, which will return a singleton with its methods. It is similar to the [revealing module pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

[1]: asset-loader.md
