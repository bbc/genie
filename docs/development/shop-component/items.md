# Items

## Item Registry

All items that appear in the shop (and therefore the game) need to exist in an item registry. Items are shaped like: 

`{ some: "json", goes: "here" }` (TBD)

The item registry is set up like this: 

```javascript
import { initRegistry } from "../core/item-registry.js";

const registry = initRegistry("registryKey", ['array' , 'of', 'items'])); // tbd
```

Keep a reference to this registry to work with items in the flow of your game.

## Accessing the registry

The registry object can either be acquired at initialisation time (returned by `initRegistry()`) or by doing `itemsRegistry.get("registryKey")`.

The registry object provides getters and setters:

- `get("item-id")` returns a single item by ID
- `getCategory("category")` returns all items in the provided category
- `set("item-id", { foo: "bar" })` updates `foo` on the matching item with value `"bar"`
