## Shop menu

This is the screen which represents a shop entry point. It renders two buttons, "Shop" and "Manage" which route to different Shop List screens, the first intended for listing items available to purchase and the second for listing the player's inventory. Both of these collections are set in the Shop Menu config, e.g [themes/default/shop-menu/config.json5], along with other parameters.


The `shop-menu` config sets the shop collections for this shop with the `shopCopllections` entry. This requires a collection to be set for each `shop` and `manage` keys:

```
{
    shopConfig: {
        shopCollections: {
            shop: "shop-items",
            manage: "inventory",
        },
        ...
    },
}
```

The player's current balance is set with the `balance` key. This determines which item from the player's inventory collection is used in the balance display:

```
{
    shopConfig: {
        ...
        balance: "coin",
        ...
    },
}
```

The `slots` available for equippable items are defined here, each key being a slot and taking `max` value for how many of these items can be equipped:

```
{
    shopConfig: {
        ...
        slots: {
            helmet: { max: 1 },
            shield: { max: 1 },
        },
    },
}
```