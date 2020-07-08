# Select Screen

* [How do I add a select screen to the game?](#how-do-i-add-a-select-screen-to-the-game)
* [How do I add items to the select screen carousel?](#how-do-i-add-items-to-the-select-screen-carousel)
* [How does it find the location of my sprite assets?](#how-does-it-find-the-location-of-my-sprite-assets)

## How do I add a select screen to the game?
- In `src/main.js` import the Select screen:

```javascript
import { Select } from "../node_modules/genie/src/components/select.js";
```

- Then, in `src/main.js` add the select screen to the `screens` object.

```javascript
const screens = {
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

Please note that the select screen should be given a descriptive name (here it is called `character-select`), as it will be used for stats purposes.

- When running the game, progressing from the home screen should now take the player to the character select screen.

## How do I add items to the select screen carousel?
- Create a config file `config.json5` inside `themes/your-theme/character-select` (where `your-theme` is the name of your theme and `character-select` is the name of your select screen).
- Add a `"choices"` array and fill it with objects containing the keys `id` and `key`. The `key` must be named the same as the key in your `asset-pack-master.json` file (see [below](#how-does-it-find-the-location-of-my-sprite-assets)).
    - `id`: A uinque id for the choice
    - `key`: This refers to the image of the thing the player is selecting. For example in a character select screen, this will be the character itself.

```json5
{
    "choices": [
        {
            "id": "dangermouse",
            "key": "danger-mouse",
        },
        {
            "id": "dennis",
            "key": "dennis-the-menace",
        }
    ]
}
```
### Choice titles

Configured choices may have text labels drawn with them. These are populated by config, using the "title" and "subtitle" keys. Example:

```json5
{
    ...
    "choices": [
        {
            "id": "dangermouse",
            "title": "Danger Mouse",
            "subtitle": "The world's greatest secret agent",
            "key": "danger-mouse",
        },
    ]
}
```

### Choice states

Choices can have states, see [states](states.md). 

```json5
{
    ...
    "choices": [
        {
            "id": "dangermouse",
            "key": "danger-mouse",
            "state": "unlocked",
        },
    ]
}
```

## Pagination

The select screen will paginate the choices based on the `rows` and `cols` parameters definied in the select screen config.

```json5
{
    "rows": 2,
    "cols" : 3,
}
```

The page displayed when first loaded can be changed by setting `choice` in transient data, under the key for the screen, e.g:

```javascript
this.transientData["level-select"].choice = { id: "dennis" }
```

The select screen will then display the appropriate page for this choice when navigated.

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
