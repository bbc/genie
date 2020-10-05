# Item system plan

TODO
* Update loader to handle collections
* Decide on namespaces
* Remove catalogue
* Expose catalogue from items list?


## Open Questions

* itemList.set might need a deeper merge. To test
* How do we namespace these under the genie localstorage tag?
* How do filters and so on map to shops? Do all items need to be defined in an item list's default? Could we just use a filter?
* Do we actually need a collection config or is it a function parameter?


### Potential user journeys (might help)


Stumped on a bit of a concept around the shop background management.

So far we have a "catalogue" which is read only and defines each item.
The game items catalogue might look something like this

```json5
[
    {
        id: "sword",    //must be unique - possibly will enforce some format.
        title: "Sword",
        description: "A sturdy iron sword.",
        categories:["weapon", "melee"],
        userData: {
            //.. keep this namespaced out in case agencies want to put object stats in here
        }
    },
    {
        id: "crossbow",
        title: "Crossbow",
        categories: ["weapon", "ranged"],
        description: "Basic wooden crossbow with standard range.",
    },

]

```

Then there are separate collections of items - e.g:
* Inventory
* Player
* Armoury
* Bakery


collections _might_ look something like this (the armoury shop collection):

```json5
{
    catalogue: "game-items",
    defaults: [
        { id: "sword", qty: 10 },
        { id: "crossbow", qty: 5 },
    ],
}
```

Collections set up the starting defaults and also handle saving the differences to local storage.

This all works fine but do we want a better way to set up the defaults?
Maybe you would want the armoury just to be all items in the "game-items" catalogue?
Then how do you know the quantities?
default to one? or infinite? or user configurable ?

Maybe I'm overthinging things? (_or am i?)
