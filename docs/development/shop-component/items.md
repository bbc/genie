# Items

## The collection

All items that appear in the shop (and therefore the game) need to exist in a [collection](../collections.md). 

Items require a unique id and, optionally, an array of tags.

```
[
    { 
        id: "Snotulon Cannon",
        tags: ["weapon"],
    }
]
``` 
Your scene config should contain a `collection` property which should be a string corresponding to the name of a .json5 file in your theme's "collections" folder _(e.g: `themes/default/collections`)_. The loader will automatically add this data to a js Map. 

```javascript
import { collections } from "/node_modules/genie/src/core/collections.js";
const items = collections.get(this.config.catalogueKey); // corresponding to a .json5 in items/
const snotulonCannon = items.get("Snotulon Cannon"); // get a single item
const weapons = items.getAll().filter(i => i.tags.includes("weapon")) //filter by tag
```

## Modifying items
You can change properties on an item by passing an object with its id and any properties you would like to change or add:

```javascript
items.set({id: "cannon", ammo: 100}); // add ammo property to cannon item
items.set({id: "cannon", qty: 0}); // update qty property to zero (none available)
items.set({id: "cannon", state: null}); // clear the state on this object (state is usually used to mark "purchased" 
```

## Equippable vs Consumable Items
Items containing a `slot` property e.g:
```json5
{ 
    id: "helmet",
    tags: ["armour"],
    slot: "head"
}
```
are automatically considered to be equippable items and will have the `equip` option on the manage screen and be marked as `equipped` in the shop.
All other (no slot property) items are considered consumable and will have the `use` action available in the shop's manage screen.


## Shop helper methods
several helper methods are available for dealing with shop collections:

```javascript
import { buy, equip, unequip, use, getBalanceItem } from "/node_modules/genie/src/shop/transact.js";

buy(scene, "helmet");       // buys the helmet. Adds helmet to inventory collection. decrements shop collection item `qty`. Decrements inventory currency balance by cost of helmet.
equip(scene, "helmet");     //sets the helmet's state to "equipped". Checks slot config for item to make sure it can be done
unequip(scene, "helmet");     //sets the helmet's state to "purchased" instead of "equipped
use(scene, "apple");    //decrements apple item `qty` in inventory 
getBalanceItem(shopConfig)  //gets the name of the currency item in inventory e.g: "coin"
```

