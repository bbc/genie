# Screen Titles

The title and subtitle for **any** screen can be defined in config, e.g: 

```json5
{
    title: {
        text: "Select",
        style: {
            fontFamily: "ReithSans",
        },
        backgroundKey: "character-select.title",
    },
    subtitle: {
        text: "Team A",
        style: {
            fontFamily: "ReithSans",
            fontSize: "26px",
        },
        backgroundKey: "character-select.subtitle",
        icon : {
            key: "character-select.subtitle-icon",
        },
    },
}
```

The title and subtitle can be a Phaser BitmapText object by supplying a `bitmapFont` asset key along with a `size`, e.g: 

```json5
{
...
    title: {
        text: "Results Screen",
        size: 30,
        bitmapFont: "examples_uiFont",
        backgroundKey: "results.title-backdrop",
    }
...
}
```