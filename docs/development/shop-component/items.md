# Items

## The collection

All items that appear in the shop (and therefore the game) need to exist in a collection. 

Items require a unique id and, optionally, an array of categories the item belongs to.

```
[
    { 
        id: "Snotulon Cannon",
        category: ["weapons"],
    }
]
``` 

Your scene config should contain a `catalogueKey` which should be a string corresponding to the name of a .json5 file in `themes/default/collections`. The loader will automatically add this data to a js Map. 

```javascript
import { collections } from "/node_modules/genie/src/core/collections.js";
const itemList = collections.get(this.config.catalogueKey); // corresponding to a .json5 in items/
const snotulonCannon = itemList.get("Snotulon Cannon"); // get a single item
const weapons = itemList.getCategory(["weapons"]); // filter by array of categories
```

## Modifying items

You can change properties on an item by passing its id to the catalogue section with an updated state object:

```javascript
const reload = { ammo: 100 };
itemList.set("Snotulon Cannon", reload); 
```
