# Genie Examples Launcher

The examples launcher page is available when _debug=true_ is added to the url.
Buttons are automatically added to the launcher page for any routes added to _src/core/debug/examples.js_

## Adding a new example

1.  Add debug screen config to the file _src/core/debug/examples.js_ . The Launcher page will be generate buttons and routes based on this config _(see example config next)_
2.  Add a named config json5 file for the screen to _/debug_
3.  Add the file path to _/debug/files.json_

## Example Config

```json5
{
    example1: {
        //The key is used to generate routes and must have a matching config
        scene: Home, //required scene class
        title: "Background Animations", //required - title for button
        routes: {
            //required, must match any route end points of the scene class
            debug: "debug", //most routes should point back to the launcher page
            //Example of custom routing function
            next: "debug",
        },
        transientData: {
            //Optional. If present replaces the entire transientData passed into the scene
            results10Sec: {
                stars: 100,
                gems: 50,
                keys: 5,
            },
        },
    },
}
```

## Screen Config Debug Properties

### debugLabels

In debug mode, any screen can have labels placed on the screen using the top level **_debugLabels_** property.

This should be an array of labels with the following format:

```json5
{
    debugLabels: [
        {
            x: -390,
            y: -190,
            text: "Example text for label",
        },
        ...
    ]
}
```

### assetPrefix

Genie defaults to matching assets prefixed with the current screen name. e.g: the _"results"_ screen's _"background"_ asset would be called _"results.background"_.

To re-use the same assets on a different screen we need to use the _assetPrefix_ property of screen config.

e.g:

```json5
assetPrefix: "character-select",
```

### Example Screen Routing Configuration


Debug routes can be configured in the same way as those in `main.js` but with somme additional paremters:

* **title:** used to name the button on the launcher screen and its aria label.
* **transientData:** Any object defined here will be passed through as the screen's transient data.
* **routes:** This is the same as before but where possible continuation routes should point back to the debug launcher screen.

Example config:
```javascript 1.8
{
    "results-10-sec": {
        scene: Results,
        title: "Results: 10s countup",
        transientData: {
            stars: 100,
            gems: 50,
            keys: 5,
        },
        routes: {
            continue: "debug",
            restart: "debug",
            home: "debug",
        },
    },
}
```
