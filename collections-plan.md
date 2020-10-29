# Transactions plan
A list of requirements to support transactions from one collection to another.

### Requirements
* Change defaults code to allow any defaults and not to force quantity
* Update local storage to support items being added and removed from collections
* Implement `moveItem` method 

### Move command description

`moveItem(object: transaction)`

```
transaction:
{
    from: String, //required
    to: String, //required
    key:  String, //required
    decrement: Integer, //default 1
    fromState: String, //optional
    toState: String, //optional
}
```

## Example Scenarios

#### Scenario 1
* Shop has 1 shield
* Player buys shield
* Shield is added to inventory
* Shield shows in shop as “owned”

**start collection states:**
shop [{key: "shield"}]
inventory []

**Command**
`collections.moveItem({key: "shield", from: "shop", to: "player", fromState: "owned"])`

**end collection state:**
shop [{key: "shield", state: "owned"}]
inventory [{key: "shield"}]

#### Scenario 2
* Shop has 5 bananas
* Player buys 1 banana
* 1 banana is added to inventory
* 4 bananas show in shop

**start collection states:**
shop [{key: "banana", qty: 5}]
inventory []

**Command**
`collections.moveItem({key: "banana", from: "shop", to: "player"})`

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
`collections.moveItem({key: "banana", from: "shop", to: "player")`

**end collection states:**
shop [{key: "banana", qty: 0}]
inventory [{key: "banana", qty: 1}]

#### Scenario 4
* Player owns a helmet
* Player equips helmet
* Inventory (management page) lists `helmet equipped`

**start collection states:**
inventory [{key: "helmet", qty: 1}]
player []

**Command**
`collections.moveItem({ key: "helmet", from: "inventory", to: "player", fromState: "equipped")`

**end collection states:**
inventory [{key: "helmet", qty: 0, state: "equipped"}]
player [{key: "helmet", qty: 1}]


### Questions:
* Do the `equipped` and `owned` tags need to be configurable? 

#### Notes
__debug.collections.get("armoury").getAll()
config - read the raw config in.
get - get a  single item by key + 
