# Transactions plan
A list of requirements to support transactions from one collection to another.

### Requirements
* Change defaults code to allow any defaults and not to force quantity
* Update local storage to support items being added and removed from collections

## Example Scenarios

#### Scenario 1
* Shop has 1 shield
* Player buys shield
* Shield is added to inventory
* Shield shows in shop as “owned”

**start collection states:**
shop [{key: "shield", qty: 0}]
inventory []

**Command**

```
shop.set({key: "shield", state: "owned", qty: -1})
inventory.set({key: "shield", qty: +1})
```

**end collection state:**
shop [{key: "shield", state: "owned", qty: 0}]
inventory [{key: "shield", qty: 1}]

#### Scenario 2
* Shop has 5 bananas
* Player buys 1 banana
* 1 banana is added to inventory
* 4 bananas show in shop

**start collection states:**
shop [{key: "banana", qty: 5}]
inventory []

**Command**
```
shop.set({key: "banana", qty: -1})
inventory.set({key: "banana",  qty: +1})
```

**end collection states:**
shop [{key: "banana", qty: 4}]
inventory [{key: "banana", qty: 1}]

#### Scenario 3
* Shop has 1 banana
* Player buys 1 banana
* 1 banana is added to inventory
* Banana shows in shop as “out of stock” (edited)

**start collection states:**
shop [{key: "banana", qty: 1}]
inventory []

**Command**
```
shop.set({key: "banana", qty: -1}) //Shop uses value of zero to label "out of stock"
inventory.set({key: "banana",  qty: +1})
```

**end collection states:**
shop [{key: "banana", qty: 0}]
inventory [{key: "banana", qty: 1}]

#### Scenario 4
* Player owns a helmet
* Player equips helmet
* Inventory (management page) lists `helmet equipped`

**start collection states:**
inventory [{key: "helmet", qty: 1}]

**Command**
```
inventory.set({key: "helmet",  state: "equipped"})
```

**end collection states:**
inventory [{key: "helmet", qty: 1, state: "equipped"}]


### Questions:
* Do the `equipped` and `owned` tags need to be configurable? 

#### Notes
__debug.collections.get("armoury").getAll()
config - read the raw config in.
get - get a  single item by key + 
