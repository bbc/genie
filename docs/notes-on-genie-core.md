# Notes on Genie Core

* [Context](#context)
* [Design Patterns Used](#design-patterns-used)


## Context

This object is passed through the game to provide information about the game's config. It contains the GMI (Game Messaging Interface) and the game state amongst other things. It also sets various properties of the game (e.g. `gameMuted` and `qaMode`).


## Design Patterns Used

Modules are created using a variant of the static factory pattern. They are first called using the `create()` method, which will return a singleton with its methods. It is similar to the [revealing module pattern](https://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript).

## Assets

Assets are stored in the Phaser cache using a dot separated path of screen name and the key from the asset pack.

For example: *"home.background"*

They can be accessed via 2 methods: 

**Method 1** 
 Use the asset path directly:
 
 `this.game.add.image(0, 0, "home.background")`

**Method 2** 
 (Inside a Screen module) Use the namespaced 'getAsset' method of the current screen - this.getAsset("background")

`this.game.add.image(0, 0, this.getAssets("background"))`


[1]: asset-loader.md
