# Event Bus
The event bus provides a lightweight wrapper to [Phaser Events Emitter](https://photonstorm.github.io/phaser3-docs/Phaser.Events.EventEmitter.html).

Rather than passing around the individual events we can just import the message bus and listen for a named event.
By importing the bus any event can be subscribed to or published.
An event is automatically created when the publish or subscribe methods are called if the event doesn't exist.

## Examples

Import to your module with the following code:
```javascript
import { eventBus } from "../../node_modules/genie/src/core/event-bus.js";
```

### Subscription example

The subscribe method takes a single a parameter - an object which describes the message subscription.

It has 3 required properties:  
***channel***: Channel names are a way to partition messages and namespace them from other messages.  
***name***: subscriptions will be fired based on a combination of **channel** and **name**.  
***callback***: The function to be called when a message is published to this channel / name combination.

Subscribe also returns an object with a unsubscribe method.

```javascript
const myCallback = data => console.log(data);
const event = eventBus.subscribe({ callback: myCallback, channel: "channelName", name: "eventName" });
event.unsubscribe(); // removes subscription
```

### Publishing example

The publish method takes a single a parameter - an object which describes a message packet.
The message packet has two required properties:

***channel***: Channel names are a way to partition messages and namespace them from other messages.  
***name***: subscriptions will be fired based on a combination of **channel** and **name**.

It also takes a third optional property called **data** which can be any arbitrary value or object.
This is passed to the subscriber callbacks functions.

```javascript
eventBus.publish({channel: "channelName", name: "eventName", data: [1,2,3] });
```

## Built in Genie Events

### gel-buttons
Genie both uses and exposes some built in events.  
The channel ***gel-buttons*** is used by all elements to publish messages when any button is clicked.

**Example of subscribing to a GEL UI continue button:**
```javascript
eventBus.subscribe({channel: "gel-buttons", name: "continue", callback: () => {/*function to call*/}})
```

### genie-settings

When settings are changed a message is published to the ***genie-settings*** channel.  
The name will be that of the setting (e.g: *audio*) and the data will be the new settings value.

An additional event with no message data is published with the name *settingsClosed* when the settings page is closed.

### Scaler
You can subscribe to the eventBus with the following channel and name to add a callback to the resize event:
```javascript
{
	"channel" : "scaler",
	"name" : "sizeChange"
}
```

## Clearing up Genie Events between Screens

On navigating to a new screen, any subscriptions to the `gel-buttons` channel are automatically removed.

Any subscriptions to the `scaler` channel, or any other custom channels, are not automatically cleared up.  
These should be tidied up by calling `event.unsubscribe()`.

When the current screen is being navigated away from, a `shutdown` event is fired.  
You can call `this.events.once` to register a one-time listener to this event, to allow cleanup between screens.

**Example of clearing up a scaler subscription:**
```javascript
create() {
	this.event = eventBus.subscribe({channel: "scaler", name: "sizeChange", callback: () => {/*function to call*/}})
	this.events.once("shutdown", this.cleanup);
}

cleanup() {
	this.event.unsubscribe();
}
```