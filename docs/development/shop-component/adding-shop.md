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

You can use the Shop as an overlay. This means you can pop it up from anywhere in your game and then return to that screen once done.

In your game code:

```
import { launchShopOverlay } from "/node_modules/genie/src/components/shop/shop.js";
```

To launch the shop, do `launchShopOverlay(screen, "shop");`

-   `screen` is the scene you're in (so you would pass `this` if you're calling from inside a class),
-   `"shop"` is the name you configured for the Shop in main.js, as a string.

You do not need a `back` route for the Shop in main.js. The back button will return the user to whichever scene called `shopOverlay`.

This can all be done in a routing function in main.js, like this:

```
    home: {
        scene: Home,
        routes: {
            next: scene => {
                shopOverlay(scene, "shop");
            },
        },
    },
    ...Shop("shop")
```
