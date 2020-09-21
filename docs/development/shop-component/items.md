# Items

## The catalogue

All items that appear in the shop (and therefore the game) need to exist in the catalogue. 

Items require a unique id and, optionally, an array of categories the item belongs to.

```json
[
    { 
        id: "Snotulon Cannon",
        category: ["weapons"],
    }
]
``` 

Your scene config should contain a `catalogueKey` which should be a string corresponding to the name of a .json5 file in `themes/default/items`. The loader will then pick them up and make them available as a map. 
 

```javascript
import { catalogue } from "./components/shop/item-catalogue.js";
const catalogueSection = catalogue.get(sceneConfig.catalogueKey); // corresponding to a .json5 in items/
const snotulonCannon = catalogueSection.get("Snotulon Cannon"); // get a single item
const weapons = catalogueSection.getCategory(["weapons"s]); // filter by array of categories
```

## Modifying items

You can change properties on an item by passing its id to the catalogue section with an updated state object:

```javascript
const reload = { ammo: 100 };
catalogueSection.set("Snotulon Cannon", reload); 
```




