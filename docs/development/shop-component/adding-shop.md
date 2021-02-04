# Using the Shop in your game

## Adding a Shop screen

As with other Genie components you can simply add a Shop entry in main.js, with navigation routes. The config and assets in `themes/default/shop` are provided as a starting point.

```
    home: {
        scene: Home,
        routes: {
            next: "shop",
            },
        },
    },
    shop: {
        scene: Shop,
        routes: {
            home: "home",
        },
    },
```

## Accessing the Shop from in-game

You can use the Shop as an overlay. Add `overlay: true` to the Shop config. Visit the Shop by calling `this.addOverlay("shop")` from within your gameplay component.
