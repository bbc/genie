# Transactions plan
A list of requirements to support transactions from one collection to another.

### TODO
* Change defaults code to allow any defaults and not to force quantity
* Update local storage to support items being added and removed from collections [DONE]
* Investigate ++ -- system
* Do we need a delete / unset method?
* Remove this file / create docs

## Example Scenarios

#### Scenario 1
* Shop has 1 shield
* Player buys shield
* Shield is added to inventory
* Shield shows in shop as “purchased”

**start collection states:**
shop [{id: "shield", qty: 0}]
inventory []

**Command**

```
shop.set({id: "shield", state: "purchased", qty: -1})
inventory.set({id: "shield", qty: +1})
```

**end collection state:**
shop [{id: "shield", state: "purchased", qty: 0}]
inventory [{id: "shield", qty: 1}]

#### Scenario 2
* Shop has 5 bananas
* Player buys 1 banana
* 1 banana is added to inventory
* 4 bananas show in shop

**start collection states:**
shop [{id: "banana", qty: 5}]
inventory []

**Command**
```
shop.set({id: "banana", qty: -1})
inventory.set({id: "banana",  qty: +1})
```

**end collection states:**
shop [{id: "banana", qty: 4}]
inventory [{id: "banana", qty: 1}]

#### Scenario 3
* Shop has 1 banana
* Player buys 1 banana
* 1 banana is added to inventory
* Banana shows in shop as “out of stock” (edited)

**start collection states:**
shop [{id: "banana", qty: 1}]
inventory []

**Command**
```
shop.set({id: "banana", qty: -1}) //Shop uses value of zero to label "out of stock"
inventory.set({id: "banana",  qty: +1})
```

**end collection states:**
shop [{id: "banana", qty: 0}]
inventory [{id: "banana", qty: 1}]

#### Scenario 4
* Player owns a helmet
* Player equips helmet
* Inventory (management page) lists `helmet equipped`

**start collection states:**
inventory [{id: "helmet", qty: 1}]

**Command**
```
inventory.set({id: "helmet",  state: "equipped"})
```

**end collection states:**
inventory [{id: "helmet", qty: 1, state: "equipped"}]


### Questions:
* Do the `equipped` and `purchased` tags need to be configurable? 

#### Notes
__debug.collections.get("armoury").getAll()
config - read the raw config in.
get - get a  single item by key + 
