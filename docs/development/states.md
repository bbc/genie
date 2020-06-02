# States

States are stored array of objects of the format:

`{id: "mary", state: "complete"}`

associated with a unique "storage key" string.

These are most commonly used with select screens to store things like locked or completed states but are not limited to any particular naming convention and games can have multiple states _(e.g: for levels and for unlockable items)_

Differences to the default state are stored in local storage.

## creating a state

To create a state pass the storage key and a config array to initState.
This will both return and add the new state to the states map so you can access it from anywhere using `states.get(###)`.

```javascript
import { initState } from "../core/states.js";

const levelStates = initState("levels", [
    { id: "donutPlains", state: "complete" },
    { id: "ghostValley", state: undefined },
    { id: "mooMooFarm" },
    { id: "rainbowRoad", state: locked },
]);
```

## Using States

```javascript
import { states } from "../core/states.js";

const levelStates = states.get("levels");

// Set rainbowRoad level to the default and save to local storage:
levelStates.set("rainbowRoad")

// Set ghostValley level to complete and save to local storage:
levelStates.set("ghostValley", "complete")
```

## State Methods

* **state.config()** returns the initial config
* **state.get(`id_string`) returns the current state of `id_string`, e.g: `{id: "id_string", state: "locked"}`
* **state.getAll()** returns the all items and their current state
* **state.set(`id`, `state`) sets the item with `id` to `state`

## Usage with Select Screen
The Genie [Select](select-screen.md) screen provides automatic integration with states when setting the `storageKey` property to the state required.
The look of individual states can be configured in the `states` block of the select screen's config.
See the [select docs](select-screen.md) for more info or visit the debug page for some working examples. 


## Debug

In debug mode _(`?debug=true` on the url)_ the states map is exposed under the debug global as `__debug.states`
