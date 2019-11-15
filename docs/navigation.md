# Navigation

* [Setup](#setup)
* [How to use](#how-to-use)
* [Passing data between screens](#passing-data-between-screens)


## Setup

`navigationConfig` is found in `main.js` and can be edited in there if needed. The way it works is as follows:

The outer keys, e.g. *'loadscreen'*, *'home'* etc. are the keynames of each game screen and must be the same keyname as set in `asset-master-pack.json` (or equivalent asset loader files).

Inside each object, there are `scene` and `routes`.

- `scene` is the class name of the screen that represents this Phaser scene. e.g. for 'loadscreen' the class name is `Loadscreen`. This class will need to be imported at the top of `main.js`.
- `routes` represent each GEL button that is accessible from this screen. The keys represent the clickable button itself, the values represent the screen that this button will take the player to once clicked.

## How to use

When in a Phaser Scene that is extended from Genie's `Screen` class, you have access to `this.navigation`. If the route exists in `navigationConfig`, you can simply use `this.navigation.next()` to send the player to the next screen.
Other examples:

`this.navigation.home()`

`this.navigation.restart()`

## Passing data between screens

If there is some data that needs to persist between screens, then assigning it to `this.transientData` will mean it is automatically passed on to the next screen:
```
this.transientData.results = results;
this.navigation.next();
````
The data can be accessed at any time with `this.transientData`.
For example, in a screen after a character has been selected, this data could be accessed in the following way: `this.transientData.characterSelected`.
