# Achievements System

## How To Enable
Achievements are enabled and configured per theme.
To enable the achievements system add `"achievements": true` to the game block of the theme config `themes/#####/config/config.json5`. e.g:

```json5
{
  "game": {
      "music": "loadscreen.backgroundMusicTwo",
      "achievements": true
    }
 }       
```

## Configuration
Once the above flag is set to true the game will attempt to load an achievements config file from `themes/#####/achievements/config.json`.

The config.json should be an array of achievement description objects:

```json
{
    "key": "first_win",
    "name": "Just Getting Started",
    "description": "You managed to crack your first egg in time.",
    "points": 100
}
```
**Required Parameters:**
* **key** [string a-z0-9_] a unique (per game) identifier, lowercase alphanumeric with underscore
* **name** [string] This is the human readable name that will be displayed in the achievements list.
* **description** [string] Description that will be displayed in the achievements list.
* **points** [integer] Currently unused but required for future use. Should add up to 1000 points per game but otherwise can be weighted for difficulty or designer preference.

## Optional Parameters
* **maxProgress** [integer] Enables the progress bar and sets its limit.
* **position** [string] This is the position that specifies where the achievements notification should show. Can be either "top" or "bottom" - defaults to "bottom".
* **additional** {prefix [string], text [string]} Add a secondary text element to the description.
The prefix of this will be in bold. e.g:
```json
{
  "additional": {"prefix": "hint", "text": "You can find these items on your travels."}
}
```
will add: "**hint:** You can find these items on your travels" to the description text.

Further examples can be found in the [starter pack achievements config](../../themes/default/achievements/config.json)

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
