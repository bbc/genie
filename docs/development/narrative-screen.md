# Narrative Screen

The narrative screen can be used to provide paged story driven events such a cut scenes or intros.


## Creating a narrative screen

Narrative screens are inserted into navigation flow from `src/main.js` in the same way other screens are configured.

_Example - adding a narrative screen after the home screen:_
```javascript
const screens = {
    home: {
        scene: Home,
        routes: {
            debug: "debug",
            next: "level1Intro"
        },
    },
    level1Intro: {
        scene: Narrative,
        routes: {
            next: "characterSelect",
        },
    }
}
```

Please note that the screen should be given a descriptive name (here it is called `level1Intro`), as it will be used for stats purposes.

### Setting a default narrative screen

To make this the default screen then set default: true in the config. Please see the example below:

```javascript
{
    level1Intro: {
        scene: Narrative,
        routes: { 
            next: "characterSelect",
        },
        default: true,
    }
}
```


## Configuring a narrative screen

The config file for any page (e.g: `themes/default/config/cutScene1.json5`) can have background items, audio and tweens.
Narrative adds a further `pages` array to tie these all together.

If the `myPageConfig.background.pages` property is not present, all tweens and audio configured on the page are started immediately.

If the `pages` property is present and configured correctly each press of the continue button will start the next set of named tweens and audio.
The first page starts automatically

_Minimal example:_

```json5
background: {
    items: [
        { name: "text1", text: "The quick brown fox", x: 0, y: 0 },
        { name: "text2", text: "Jumped over the lazy dog.", x: 0, y: 0 }
    ],
    tweens: [
        { name: "hideAll", targets: ["text1", "text2"], alpha: { from: 0, to: 0 }, duration: 1 },
        { name: "show1", targets: ["text1"], alpha: { from: 0, to: 1 }, duration: 1000 },
        { name: "hide1", targets: ["text1"], alpha: { from: 1, to: 0 }, duration: 500 },
        { name: "show2", targets: ["text2"], alpha: { from: 0, to: 1 }, duration: 1000 },
    ],
    audio: [
        { name: "speech1", key: "cutScene1.speech1", type: "dialogue", delay: 0.5, volume: 0.15},
        { name: "speech2", key: "cutScene1.speech2", type: "dialogue", delay: 0.5, volume: 0.15},
    ],
    pages: [
        ["hideall", "show1", "speech1"],
        ["hide1", "show2", "speech2]
    ]

}
```
The above will start by showing `text1` and playing the `cutScene1.speech1` audio file.
Then when continue is pressed `text1` will be hidden, `text2` will be shown and `cutScene1.speech2` audio will be played.

the `name` tag on each bit of config is what ties everything together:

* **item.name** is used in the `targets` property of tweens.
* **tween.name** is used by the pages array to group tweens.
* **audio.name** is used by the pages array to group audio.

For a comprehensive example start your game in debug mode by adding `?debug=true` to the url and visit the debug examples launcher page.

## Notes

* `audio.delay` is specified in seconds (unlike most things in Phaser which are specified in milliseconds)
* `audio.type` must be present and set to one of either `music | sfx | dialogue`. This property will be utilised by future audio settings.
* Particles emitters can be turned on and off by tweening their `on` property to either `0` or `1`
