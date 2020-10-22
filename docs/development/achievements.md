# Achievements System

## Requirements for Genie components:

- Genie components should be made with a pool of **at least 20** achievements.  
- Every theme should have some achievements.
- A theming agency can pick a **maximum of 10** of these achievements from the pool to use in any one theme.  
- The whole pool of achievements should be made available so that they can be tested.

## Using Achievements

Achievements are enabled and configured in the theme.

The game will attempt to load achievements from `themes/#####/achievements/config.json5`.

This `config.json5` should contain an array of achievement description objects. To disable achievements, make this array empty. 

Achievement description objects look like this:

```json
{
    "key": "first_win",
    "name": "Just Getting Started",
    "description": "You managed to crack your first egg in time.",
    "points": 100
}
```

`name` and `description` should be changed from their defaults to values that fit the look and feel of your game. These objects should also be ordered sensibly to reflect progression in your game.

**Required Parameters:**
* **key** [string a-z0-9_] a unique (per game) identifier, lowercase alphanumeric with underscore. The key is used for the asset, which will convert underscores to dashes when loading (e.g `this_key` will become `this-key.png`).
* **name** [string] This is the human readable name that will be displayed in the achievements list.
* **description** [string] Description that will be displayed in the achievements list.
* **points** [integer] Currently unused but required for future use. The total of all points should add up to 1000 points. Points per achievement are not required to be divided equally, they can be distributed based on difficulty / designer preference. Points should be rounded up (e.g. 10, 50, 100 not 11, 53, 101). The total should still meet 1000 points.

**Optional Parameters:**
* **maxProgress** [integer] Enables the progress bar and sets its limit.
* **position** [string] This is the position that specifies where the achievements notification should show. Can be either "top" or "bottom" - defaults to "bottom".

Further examples can be found in the [starter pack achievements config](../../themes/default/achievements/config.json5)

#### String Lengths
Achievement names and descriptions should be an appropriate length so as not to be cut off, or for the text to overflow out of the notification box that appears in-game when a user earns an achievement.
Manual quality checks will be needed to satisfy this requirement.

## Updating achievement status
To update an achievement use the `gmi.achievements.set({data object})` method.
The gmi is best imported into a game component from genie core (this will avoid legacy problems using window.getGMI())

```js
import { gmi } from "../../node_modules/genie/src/core/gmi/gmi.js";
```
An object with the achievement info needs to be passed into the set function.

To mark an achievement without a progress meter as complete you would use:
`gmi.achievements.set({ key: "test_1" });`

To update the progress of an achievement with a progress meter you would use:
`gmi.achievements.set({ key: "test_2", progress: 20 });`

If the value for progress is more than the value for **maxProgress** set in `achievements/config.json` then it will be marked as achieved.

**Note on return value:** the return value of `gmi.achievements.set` is true if this call resulted in something becoming fully achieved. Otherwise it returns false.

All achievements data is automatically stored in local storage.

## Retrieving achievements status
A call to `gmi.achievements.get()` will return an array matching the achievements config with any additional data from local storage ( e.g: achieved status or current progress value)

## Button styling and indicator
The following theme files should not be edited. It is a requirement that they remain consistent across games:

* _themes/#####/gel/desktop/notification.mp3_
* _themes/#####/gel/desktop/notification.png_
* _themes/#####/gel/mobile/notification.png_
* _themes/#####/gel/desktop/achievements.png_
* _themes/#####/gel/mobile/achievements.png_

## Debugging
Adding the flag `&debug=true` to the end of the url when developing locally will make the fake dev gmi console log calls to `gmi.achievements init/get/set`.
