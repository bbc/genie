# Items

## Item Registry

All items that appear in the shop (and therefore the game) need to exist in an item registry. Items are shaped like: 

`{ some: "json", goes: "here" }` (TBD)

The item registry is set up like this: 

```javascript
import { initItems } from "../core/item-registry.js";

const items = initItems(['array' , 'of', 'items'])); // tbd
```

