# Using the Shop in your game

## Adding a Shop screen

As with other Genie components you must add a Shop entry to your `screens` array in main.js: 


```
    home: {
        scene: Home,
        routes: {
            next: "shop",
            },
        },
    },
    ...Shop({ key: "shop", routes: { back: "home" }})
```

When adding to your game's `screens` array you only need to specify a `back` route.

The Shop consists of three screens; `menu`, `list` and `confirm`.

The above code creates a Home screen with a 'next' button that points to Shop Menu, and a 'back' button in the Shop screens which point to Home. 

The three Shop screens will be created from here, with config and assets in `themes/default/shop-*` provided as a starting point. 

### Setting a default narrative screen

To make this the default screen then set default: true in the config. Please see the example below:

```javascript
{
    ...Shop({ key: "shop", routes: { back: "home" }, 
    default: true})
}
```


## Launching the Shop from in-game (overlay)

You can use the Shop as an overlay. This means you can pop it up from anywhere in your game and then return to that screen once done.

In your game code:

```
import { launchShopOverlay } from "/node_modules/genie/src/components/shop/shop.js";
```

To launch the shop, do `launchShopOverlay(screen, "shop");`

-   `screen` is the scene you're in (so you would pass `this` if you're calling from inside a class),
-   `"shop"` is the name you configured for the Shop in main.js, as a string.

You do not need a `back` route for the Shop when it is being used as an overlay, the back button will close the overlay.

This can all be done in a routing function in main.js, like this:

```
    home: {
        scene: Home,
        routes: {
            next: scene => {
                launchShopOverlay(scene, "shop");
            },
        },
    },
    ...Shop({ key: "shop", routes: {} })
```


## Shop configuration

Each shop requires 3 configurations, for "menu", "list" and "confirm" screens. The three screens are named by prepending to your shop key with `-menu`, `-list` and `-confirm`. 
The default shop key is `shop`, so the three screens and configs are named `shop-menu`, `shop-list` and `shop-confirm`. The key should contain `shop` somewhere in the name.


### Shop menu

A shop entry point menu screen with 'Shop' and 'Manage' buttons to direct the player to the lists of item collections.

See [shop menu](shop-menu.md)


### Shop list

This lists collections of items, i.e available items to purchase and the player's inventory.

See [shop list](shop-list.md)


### Shop confirm

This screen is shown when an item is selected.

See [shop confirm](shop-confirm.md)


### Collections

All items for use in game and player's inventory are initially defined by collections.

See [items](items.md)
