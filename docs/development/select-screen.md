# Select Screen

* [How do I add a select screen to the game?](#how-do-i-add-a-select-screen-to-the-game)
* [How do I add items to the select screen carousel?](#how-do-i-add-items-to-the-select-screen-carousel)
* [How does it find the location of my sprite assets?](#how-does-it-find-the-location-of-my-sprite-assets)

## How do I add a select screen to the game?
- In `src/main.js` import the Select screen:

```javascript
import { Select } from "../node_modules/genie/src/components/select.js";
```

- Then, in `src/main.js` add the select screen to the `screenConfig object`.

```javascript
const screenConfig = {
    ...
    home: {
        scene: Home,
        routes: {
            next: "character-select",
        },
    },
    "character-select": {
        scene: Select,
        routes: {
            next: "level-select",
            home: "home",
        },
    },
    ...
};
```

- When running the game, progressing from the home screen should now take the player to the character select screen.

## How do I add items to the select screen carousel?
- Create a suitable config file, e.g: `character-select-json5.json` inside `themes/your-theme/config` (where `your-theme` is the name of your theme).
- Add a `"choices"` array to your select options and fill it with objects containing the keys `main` and `name`. These must be named the same as the key in your `asset-pack-master.json` file (see [below](#how-does-it-find-the-location-of-my-sprite-assets)).
    - `main`: This refers to the image of the thing the player is selecting. For example in a character select screen, this will be the character itself.
    - `name`: This refers to the image of the name of the thing the player is selecting. For example in a character select screen, it will simply be an image of the character's name.

```json5
{
    "theme": {
        "character-select": {
            "choices": [
                {
                    "main": "dangermouse",
                    "name": "dangermouseName"
                },
                {
                    "main": "barney",
                    "name": "barneyName"
                }
            ]
        }
    }
}
```
### Choice titles

Configured choices may have text labels drawn with them. These are populated by config, using the "title" and "subtitle" keys. Example:

```json5
{
    ...
    "choices": [
        {
            "main": "dangermouse",
            "name": "dangermouseName",
            "title": "Danger Mouse",
            "subtitle": "The world's greatest secret agent",
        },
    ]
}          
```

#### Choice text styling

Choice text elements must have default styling associated with their text elements. Default styles are set within the select screen config, in the object `choicesStyling`, example:

```json5
{
    ...
    "choices": [...],
    "choicesStyling": {
        "default": {
            "title": {
                "style": {
                    "fontFamily": "ReithSans",
                    "fontSize": "19px",
                    "color": "#424242",
                    "backgroundColor": "#fff",
                    "fixedWidth": 75,
                    "align": "center",
                    "padding": {
                        "left": 6,
                        "right": 6,
                        "top": 2,
                        "bottom": 2,
                    },
                },
                "position": {
                    "x": 0,
                    "y": 53,
                },
            },
            "subtitle": {
                "style": {
                    ...
                },
                "position": {
                    ...
                }
            }
        }
    }
}
```

*Both `position` and `style` objects are required for the text to be be displayed.*

Styles for different button states can override the default styles for each of the elements:

```json5
{
    ...
    "default": { 
        ...
    },
    "locked": {
        "title": {
            "style": {
                "color": "#fff",
                "backgroundColor": "#7d4b4b",
            },
        },
        "subtitle": {
            ...
        }
    }
}
```

## How does it find the location of my sprite assets?

- Locate the file `asset-pack-master.json` located inside `themes/your-theme/` (where `your-theme` is the name of your theme).
- Add your sprite locations and preferred key names to this file.

```json
{
    ...
    "character-select": {
        "prefix": "character-select.",
        "files": [
            {
                "type": "image",
                "key": "dangermouse",
                "url": "options/dangermouse_sel.png"
            },
            {
                "type": "image",
                "key": "dangermouseName",
                "url": "options/dangermouse_sel_name.png"
            },
            {
                "type": "image",
                "key": "barney",
                "url": "options/barney_sel.png"
            },
            {
                "type": "image",
                "key": "barneyName",
                "url": "options/barney_sel_name.png"
            }
        ]
    }
    ...
}
```

[More examples of asset packs in Phaser](https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html#pack__anchor)
