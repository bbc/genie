# Items

## Item Registry

All items that appear in the shop (and therefore the game) need to exist in an item registry. Items are shaped like: 

`{ some: "json", goes: "here" }` (TBD)

The item registry is set up like this: 

```javascript
import { initItems } from "../core/item-registry.js";

const registry = initItems(['array' , 'of', 'items'])); // tbd
```

## Accessing the registry

The registry object returned by initItems provides getters and setters:

`get("item-id")` returns a single item by ID, if it exists.

`get("item-id", ["array", "of", "categories"])` returns a single item by ID, if it is in one of the provided categories.

`getCategory("category")` returns all items in the provided category.

`set(item)` replaces the item with a matching ID in the registry; returns `true` if successful or `false` if the item did not exist (adding items to the registry in mid-game is not permitted.)