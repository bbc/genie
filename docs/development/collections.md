# Collections

Collections are a way to store arrays of objects using the format:

`{id: "mary", state: "complete"}`

They are associated with a unique "storage key" string.

Commonly used with select screens to store things like locked or completed states but are not limited to any particular naming 
convention and games can have multiple collections _(e.g: for levels and for unlockable items)_

Differences to the default config are stored in local storage.

## Creating a collection
To create a collection pass the storage key and a config array to initCollection.
This will both return and add the new collection to the collections map so you can access it from anywhere using `collections.get(###)`.

```javascript
import { initCollection } from "../core/collections.js";

const levelCollection = initCollection(this)("levels", [
    { id: "donutPlains", state: "complete" },
    { id: "ghostValley", state: undefined },
    { id: "mooMooFarm" },
    { id: "rainbowRoad", state: locked },
]);
```

## Using Collections

```javascript
import { collections } from "../core/collections.js";

const levels = collections.get("levels");

// Set rainbowRoad level to the default and save to local storage:
levels.set("rainbowRoad")

// Set ghostValley level to complete and save to local storage:
levels.set({id: "ghostValley", state: "complete"})
```

## Collection Methods

* **collection.config()** returns the initial config
* **collection.get(`id_string`)** returns the current state of `id_string`, e.g: `{id: "id_string", state: "locked"}`
* **collection.getAll()** returns all items and their current state
* **collection.set(`id`, `state`)** sets the item with `id` to `state`
* **collection.setUnique(`{ id, key, value }`)** adds a new `key`-`value` pair to the item with `id`
* **collection.getUnique(`{ key, value }`)** returns the unique item with `key`-`value` pair

## Usage with Select Screen
The Genie [Select](select-screen.md) screen provides automatic integration with collections when setting the `storageKey` property to the collection required.
The look of individual item states can be configured in the `states` block of the select screen's config.
See the [select docs](select-screen.md) for more info or visit the debug page for some working examples. 


## Debug

In debug mode _(`?debug=true` on the url)_ the collections map is exposed under the debug global as `__debug.collections`
