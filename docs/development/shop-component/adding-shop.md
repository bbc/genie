# Using the Shop in your game

## Adding a Shop screen

As with other Genie components you must add a Shop entry to your `screens` array in main.js. The config and assets in `themes/default/shop` are provided as a starting point. You only need to specify a `back` route.

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
            back: "home",
        },
    },
```

The above code creates a Home screen with a 'next' button that points to Shop, and a 'back' button in Shop that points to Home.

## Launching the Shop from in-game

You can use the Shop as an overlay. This means you can pop it up from anywhere in your game and then return to that point once done.

To do this:

```
import { shopOverlay } from "/node_modules/genie/src/components/shop/shop.js";
```

Then, to launch the shop, do `shopOverlay(screen, "shop")`. Note that:

-   `screen` is the scene you're in (so you would pass `this` if you're calling from inside a class),
-   `"shop"` is the screen name you configured for the Shop in main.js, as a string.

Finally, add `isOverlay: true` to your Shop's `config.json5`. This will tell Shop to use its back button to return the player to where they came from (and you no longer need a `back` route for the Shop in main.js.)

These approaches can be combined by using custom routing functions in `screens` in main.js, like this:

```
    home: {
        scene: Home,
        routes: {
            next: scene => {
                shopOverlay(scene, "shop");
            },
        },
    },
```

In this way you can visit the Shop from multiple screens and automatically get the correct 'back' function.
